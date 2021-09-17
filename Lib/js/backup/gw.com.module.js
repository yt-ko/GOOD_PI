//------------------------------------------
// Module about Common UI Processing.
//                Created by Professor.X, GoodWare (2011.03)
//------------------------------------------ 

var gw_com_module = {

    // variable.
    v_Session: {
        USR_ID: null,
        GW_ID: null,
        USR_NM: null,
        EMP_NO: null,
        DEPT_CD: null,
        DEPT_NM: null,
        POS_CD: null,
        POS_NM: null,
        DEPT_AREA: null,
        DEPT_AUTH: null,
        USER_TP: null,
        CUR_DB: "PLM",
        CUR_LANG: "kr"
    },
    v_Option: {
        authority: {
            usable: false,
            control: "CRUD"
        },
        message: false,
        datatype: ""
    },
    v_Current: {
        window: null,
        launch: null,
        caller: {
            type: null,
            page: null
        },
        loaded: false,
        act: null,
        object: null,
        dialogue: null,
        menu_args: null
    },
    v_Code: [],
    v_Object: [],
    v_Control: {},

    // process by event.
    eventBind: function (args) {

        var param = {
            object: args.targetid,
            row: 1,
            element: args.element
        }
        if (args.grid) {
            param.type = "GRID";
            var targetobj = "#" + args.targetid + "_data";
            if (args.element != undefined) {
                var event = $.data($(targetobj)[0], "event");
                event[args.element + "_" + args.event] = args.handler;
            }
            else {
                if (args.event == "rowselecting"
                    || args.event == "rowselected"
                    || args.event == "rowdblclick"
                    || args.event == "rowkeyenter"
                    || args.event == "cellselected"
                    || args.event == "itemchanged"
                    || args.event == "itemkeyup"
                    || args.event == "itemkeypress"
                    || args.event == "itemdblclick"
                    || args.event == "itemkeyenter") {
                    var event = $.data($(targetobj)[0], "event");
                    event[args.event] = args.handler;
                }
                else {
                    $(targetobj).bind(args.event, function () {
                        return args.handler(param);
                    });
                }
            }
        }
        else {
            param.type = "FORM";
            if (args.element != undefined) {
                var targetobj = "#" + args.targetid + "_" + args.element;
                if (args.event == "keypress") {
                    $(targetobj).bind(args.event, function (event) {
                        param.key = event.which;
                        return args.handler(param);
                    });
                }
                else {
                    $(targetobj).bind(args.event, function () {
                        return args.handler(param);
                    });
                }
            }
            else {
                var targetobj = "#" + args.targetid;
                if (args.event == "itemchanged"
                    || args.event == "itemdblclick"
                    || args.event == "itemkeyenter") {
                    var event = $.data($(targetobj)[0], "event");
                    event[args.event] = args.handler;
                }
                else if (args.event == "tabselect") {
                    $(targetobj).bind("tabsselect", function (event, ui) {
                        param.type = "TAB";
                        param.row = ui.index + 1;
                        return args.handler(param);
                    });
                }
                else {
                    var targetobj = "#" + args.targetid;
                    $(targetobj).bind(args.event, function () {
                        return args.handler(param);
                    });
                }
            }
        }

    },

    // to argument.
    toParam: function (args) {

        var params = "";
        $.each(args, function (i) {
            params = params + ((i == 0) ? "?" : "&");
            params = params + this.name + "=" + this.value;
        });
        return params;

    },

    // to argument.
    toARG: function (args) {

        var params = {
            query: "",
            obj: {}
        };
        $.each(args, function (i) {
            params.query = params.query + "&";
            params.query = params.query +
                encodeURIComponent(
                    (this.argument != undefined) ? this.argument : this.name) +
                "=" +
                encodeURIComponent(this.value);
            params.obj[this.name] = this.value;
        });
        return params;

    },

    // to JSON.
    toJSON: function (args) {

        var params = {
            query: {
                ARGUMENT: [],
                VALUE: []
            },
            obj: {}
        };
        $.each(args, function (i) {
            params.query.ARGUMENT.push(
                encodeURIComponent(
                    (this.argument != undefined) ? this.argument : this.name));
            params.query.VALUE.push(
                encodeURIComponent(this.value));
            params.obj[this.name] = this.value;
        });
        return params;

    },

    // to argument. (element)
    elementtoARG: function (args) {

        var params = {
            query: "",
            obj: {}
        };
        switch (args.type) {
            case "FORM":
                {
                    var targetobj = "#" + args.targetid;
                    $.each(args.element, function (i) {
                        var el = "#" + args.targetid + "_" + this.name;
                        var value = "";
                        switch ($(el).attr("type")) {
                            case "checkbox":
                                {
                                    value = ($(el).attr("checked"))
                                        ? $(el).attr("onval") : $(el).attr("offval");
                                }
                                break;
                            case "radio":
                                {
                                    var el = targetobj + " :radio[name='" + this.name + "']";
                                    $.each(el, function () {
                                        if (this.checked)
                                            value = this.value;
                                    });
                                }
                                break;
                            default:
                                {
                                    if ($(el).attr("mask") != undefined) {
                                        var param = {
                                            targetobj: el
                                        };
                                        value = gw_com_module.textunMask(param);
                                    }
                                    else if ($(el).attr("keyword")) {
                                        value = $(el).val().replace(/\s/g, "");
                                        if (value == "")
                                            value = "1=1";
                                        else {
                                            value = "@" + value.replace(/\+/g, "@+@").replace(/\,/g, "@,@").replace(/\(/g, "@(@").replace(/\)/g, "@)@");
                                            var where = value.replace(/\+|\,|\(|\)/g, "|").split("|");
                                            $.each(where, function () {
                                                if (this.replace(/\@/g, "") != "")
                                                    value = value.replace(this, args.element[i].name + " like '%'|'" + this + "'|'%'");
                                            });
                                            value = value.replace(/\@/g, "").replace(/\+/g, " and ").replace(/\,/g, " or ");
                                        }
                                    }
                                    else
                                        value = $(el).val();
                                }
                                break;
                        }
                        if (args.all != false
                            && (value === "" || value == null))
                            value = "%";
                        params.query = params.query +
                            ((args.seperator != undefined) ? args.seperator : "&");
                        params.query = params.query +
                            ((this.argument != undefined)
                                ? encodeURIComponent(this.argument)
                                : encodeURIComponent(this.name)) +
                            "=" +
                            encodeURIComponent(value);
                        params.obj[this.name] = value;
                    });
                }
                break;
            case "GRID":
                {
                    var targetobj = "#" + args.targetid + "_data";
                    var row = (args.row == "selected")
                        ? $(targetobj).jqGrid('getGridParam', 'selrow') : args.row;
                    $.each(args.element, function (i) {
                        //var value = $(targetobj).jqGrid('getCell', row, this.name);
                        var value = gw_com_api.getCellValue("GRID", args.targetid, row, this.name);
                        params.query = params.query +
                            ((args.seperator != undefined) ? args.seperator : "&");
                        params.query = params.query +
                            ((this.argument != undefined)
                                ? encodeURIComponent(this.argument)
                                : encodeURIComponent(this.name)) +
                            "=" +
                            encodeURIComponent(value);
                        params.obj[this.name] = value;
                    });
                }
                break;
        }
        if (args.argument != undefined) {
            $.each(args.argument, function () {
                params.query = params.query +
                    ((args.seperator != undefined) ? args.seperator : "&");
                params.query = params.query +
                    encodeURIComponent(this.name) +
                    "=" +
                    encodeURIComponent(this.value);
                params.obj[this.name] = this.value;
            });
        }
        return params;

    },

    // to JSON. (element)
    elementtoJSON: function (args) {

        var params = {
            query: {
                ARGUMENT: [],
                VALUE: []
            },
            obj: {}
        };
        switch (args.type) {
            case "FORM":
                {
                    var targetobj = "#" + args.targetid;
                    $.each(args.element, function (i) {
                        var el = "#" + args.targetid + "_" + this.name;
                        var value = "";
                        switch ($(el).attr("type")) {
                            case "checkbox":
                                {
                                    value = $(el).attr("checked")
                                        ? $(el).attr("onval") : $(el).attr("offval");
                                }
                                break;
                            case "radio":
                                {
                                    var el = targetobj + " :radio[name='" + this.name + "']";
                                    $.each(el, function () {
                                        if (this.checked)
                                            value = this.value;
                                    });
                                }
                                break;
                            default:
                                {
                                    if ($(el).attr("mask") != undefined) {
                                        var param = {
                                            targetobj: el
                                        };
                                        value = gw_com_module.textunMask(param);
                                    }
                                    else
                                        value = $(el).val();
                                }
                                break;
                        }
                        if (args.all != false
                            && (value === "" || value == null))
                            value = "%";
                        params.query.ARGUMENT.push(
                            ((this.argument != undefined)
                                ? encodeURIComponent(this.argument)
                                : encodeURIComponent(this.name)));
                        params.query.VALUE.push(encodeURIComponent(value));
                        params.obj[this.name] = value;
                    });
                }
                break;
            case "GRID":
                {
                    var targetobj = "#" + args.targetid + "_data";
                    var row = (args.row == "selected")
                        ? $(targetobj).jqGrid('getGridParam', 'selrow') : args.row;
                    $.each(args.element, function (i) {
                        //var value = $(targetobj).jqGrid('getCell', row, this.name);
                        var value = gw_com_api.getCellValue("GRID", args.targetid, row, this.name);
                        params.query.ARGUMENT.push(
                            ((this.argument != undefined)
                                ? encodeURIComponent(this.argument)
                                : encodeURIComponent(this.name)));
                        params.query.VALUE.push(encodeURIComponent(value));
                        params.obj[this.name] = value;
                    });
                }
                break;
        }
        if (args.argument != undefined) {
            $.each(args.argument, function () {
                params.query.ARGUMENT.push(encodeURIComponent(this.name));
                params.query.VALUE.push(encodeURIComponent(this.value));
                params.obj[this.name] = this.value;
            });
        }
        return params;

    },

    // to remark. (element)
    elementtoRemark: function (args) {

        var remark = "";
        $.each(args.remark, function (i) {
            var text =
                "[" +
                ((this.label != undefined) ? this.label + " " : "");
            $.each(this.element, function (j) {
                var type = gw_com_api.getInputType(args.id, 1, this.name, (args.type == "GRID") ? true : false);
                if (type != "checkbox"
                    && j == 0 && args.remark[i].label == undefined) {
                    var label = gw_com_api.getAttribute(args.id, "label", 1, this.name, (args.type == "GRID") ? true : false);
                    text = text +
                        label + ((label != "") ? " " : "");
                }
                var title = gw_com_api.getText(args.id, 1, this.name, (args.type == "GRID") ? true : false);
                var value = gw_com_api.getValue(args.id, 1, this.name, (args.type == "GRID") ? true : false);
                text = (title == "" || (value == "%" || value == ""))
                    ? "" : text + ((j > 0) ? " " + args.remark[i].infix + " " : "") + title;
            });
            remark = remark + ((text == "") ? "" : " " + text + "]");
        });
        return remark;

    },

    // to argument. (updatable)
    updatabletoARG: function (args) {

        var request = {
            DATA: {
                USER: this.v_Session.USR_ID,
                OBJECTS: [],
                OPTION: {
                    NAME: [],
                    VALUE: []
                }
            }
        };
        $.each(args.target, function (i) {
            switch (this.type) {
                case "FORM":
                    {
                        var targetobj = "#" + this.id;
                        var updatable = {};
                        updatable.QUERY = $(targetobj).attr("query");
                        updatable.ROWS = [];
                        $.each(gw_com_module.v_Object[this.id].buffer.remove, function (j) {
                            updatable.ROWS.push(this);
                        });
                        var crud = $(targetobj + "_CRUD").val();
                        if (crud == "C"
                            || crud == "U") {
                            var master = $.data($(targetobj)[0], "master");
                            var data = {
                                COLUMN: [],
                                VALUE: []
                            };
                            var skip = ":submit, :reset, :image, [disabled], [readonly]";
                            var elements = $(targetobj + " :input").not(skip).add(targetobj + " [noeditable=false]");
                            for (jj = 0; jj < elements.length; jj++) {
                                var value = "";
                                if ($("#" + elements[jj].id).attr("display"))
                                    continue;
                                else if (crud == "C"
                                    && elements[jj].value == ""
                                    && master != undefined
                                    && master[elements[jj].name] != undefined)
                                    value = master[elements[jj].name];

                                else {
                                    switch (elements[jj].type) {
                                        case "checkbox":
                                            {
                                                value = $(elements[jj]).attr("checked")
                                                    ? $(elements[jj]).attr("onval")
                                                    : $(elements[jj]).attr("offval");
                                            }
                                            break;
                                        case "radio":
                                            {
                                                var radio =
                                                    $(targetobj + " :radio[name='" + elements[jj].name + "']");
                                                $.each(radio, function () {
                                                    if (this.checked)
                                                        value = this.value;
                                                });
                                                jj = jj + radio.length - 1;
                                            }
                                            break;
                                        case "hidden":
                                            {
                                                var control =
                                                    gw_com_module.v_Control[$(elements[jj]).attr("control")];
                                                if (control != undefined) {
                                                    switch (control.by) {
                                                        case "DX":
                                                            {
                                                                switch (control.type) {
                                                                    case "htmleditor":
                                                                        {
                                                                            value = control.id.GetHtml();
                                                                        }
                                                                        break;
                                                                }
                                                            }
                                                            break;
                                                    }
                                                }
                                                else
                                                    value = elements[jj].value;
                                            }
                                            break;
                                        default:
                                            {
                                                if ($(elements[jj]).attr("mask") != undefined) {
                                                    var param = {
                                                        targetobj: "#" + elements[jj].id
                                                    };
                                                    value = gw_com_module.textunMask(param);
                                                }
                                                else
                                                    value = elements[jj].value;
                                            }
                                            break;
                                    }
                                }
                                data.COLUMN.push(encodeURIComponent(elements[jj].name));
                                data.VALUE.push(encodeURIComponent(value));
                            }
                            updatable.ROWS.push(data);
                        }
                        if (updatable.ROWS.length > 0)
                            request.DATA.OBJECTS.push(updatable);
                    }
                    break;
                case "GRID":
                    {
                        var updatable = {};
                        updatable.QUERY = $("#" + this.id + "_data").attr("query");
                        updatable.ROWS = [];
                        $.each(gw_com_module.v_Object[this.id].buffer.remove, function (j) {
                            updatable.ROWS.push(this);
                        });
                        if ($("#" + this.id).attr("sheet")) {
                            var targetobj = "#" + this.id + "_data";
                            var obj = this.id;
                            $.each(gw_com_module.v_Object[this.id].buffer.insert, function (j) {
                                var data = {
                                    COLUMN: [],
                                    VALUE: []
                                };
                                var row = this;
                                $.each(gw_com_module.v_Object[obj].option.cells, function (k) {
                                    if (gw_com_module.v_Object[obj].option[this] != undefined
                                        && gw_com_module.v_Object[obj].option[this].edit != false
                                        && !gw_com_module.v_Object[obj].option[this].display) {
                                        var name = gw_com_module.v_Object[obj].option.cells[k];
                                        var value = gw_com_api.getValue(obj, row, name, true);
                                        data.COLUMN.push(encodeURIComponent(name));
                                        data.VALUE.push(encodeURIComponent(value));
                                    }
                                });
                                updatable.ROWS.push(data);
                            });
                            var save = $(targetobj).jqGrid('getChangedCells', 'all');
                            $.each(save, function (j) {
                                var row = this;
                                if (row._CRUD != undefined && row._CRUD == "U") {
                                    var data = {
                                        COLUMN: [],
                                        VALUE: []
                                    };
                                    $.each(gw_com_module.v_Object[obj].option.cells, function (k) {
                                        if (row[this] != undefined
                                            && gw_com_module.v_Object[obj].option[this] != undefined
                                            && gw_com_module.v_Object[obj].option[this].edit != false
                                            && !gw_com_module.v_Object[obj].option[this].display) {
                                            var value = "";
                                            switch (gw_com_module.v_Object[obj].option[this].edit) {
                                                case "select":
                                                    {
                                                        var el = document.createElement("div");
                                                        $(el).html(row[this]);
                                                        value = $(el).find("input").val();
                                                    }
                                                    break;
                                                default:
                                                    value = gw_com_api.unMask(
                                                        row[this],
                                                        gw_com_module.v_Object[obj].option[this].mask
                                                    );
                                                    break;
                                            }
                                            data.COLUMN.push(encodeURIComponent(this));
                                            data.VALUE.push(encodeURIComponent(value));
                                        }
                                    });
                                    updatable.ROWS.push(data);
                                }
                            });
                        }
                        else {
                            var targetobj = "#" + this.id + "_form";
                            var obj = this.id;
                            var element = $(targetobj + " :input[name='_CRUD']");
                            $.each(element, function (j) {
                                var crud = this.value;
                                if (crud == "C"
                                    || crud == "U") {
                                    var master = $.data($(targetobj)[0], "master");
                                    var row = (this.id.split("_"))[0];
                                    var data = {
                                        COLUMN: [],
                                        VALUE: []
                                    };
                                    var skip = ":submit, :reset, :image, [disabled=true]";
                                    var columns = $(targetobj).find(":input[id^='" + row + "_']").not(skip);
                                    $.each(columns, function (k) {
                                        if ($(this).attr("display"))
                                            return;
                                        var name = this.name;
                                        if ($(this).attr("type") == "radio") {
                                            if ($(this).attr("checked") != true) return;
                                            name = (this.id.split("_")).slice(1).join("_");
                                            var value = (($(this).attr("mask") != undefined)
                                                ? gw_com_api.unformatData(this) : this.value);

                                            var len = name.split("_").length;
                                            if (len > 0)
                                                name = name.split("_").slice(0, len - 1).join("_");

                                            data.COLUMN.push(encodeURIComponent(name));
                                            data.VALUE.push(encodeURIComponent(value));
                                            return true;
                                        }
                                        //var value = (crud == "C"
                                        //                && this.value == ""
                                        //                && master != undefined
                                        //                && master[name] != undefined)
                                        //            ? master[name]
                                        //            : (($(this).attr("mask") != undefined)
                                        //                ? gw_com_api.unformatData(this) : this.value);
                                        var value = (($(this).attr("mask") != undefined)
                                            ? gw_com_api.unformatData(this) : this.value);
                                        if ($(this).attr("type") == "textarea")
                                            value = $.trim(value);
                                        data.COLUMN.push(encodeURIComponent(name));
                                        data.VALUE.push(encodeURIComponent(value));
                                    });
                                    updatable.ROWS.push(data);
                                }
                            });
                        }
                        if (updatable.ROWS.length > 0)
                            request.DATA.OBJECTS.push(updatable);
                    }
                    break;
            }
        });
        if (args.option != undefined) {
            $.each(args.option, function (i) {
                request.DATA.OPTION.NAME.push(encodeURIComponent(this.name));
                request.DATA.OPTION.VALUE.push(encodeURIComponent(this.value));
            });
        }
        return (request.DATA.OBJECTS.length > 0) ? JSON.stringify(request) : null;

    },

    // to argument. (key)
    keytoARG: function (args) {

        var request = {
            DATA: {
                USER: this.v_Session.USR_ID,
                OBJECTS: [],
                OPTION: {
                    NAME: [],
                    VALUE: []
                }
            }
        };
        $.each(args.target, function (i) {
            var obj = this.id;
            switch (this.type) {
                case "FORM":
                    {
                        var updatable = {};
                        updatable.QUERY = $("#" + obj).attr("query");
                        updatable.ROWS = [];
                        var data = {
                            COLUMN: [],
                            VALUE: []
                        };
                        $.each(this.key.element, function (j) {
                            data.COLUMN.push(encodeURIComponent(this.name));
                            data.VALUE.push(
                                encodeURIComponent(gw_com_api.getValue(obj, 1, this.name))
                            );
                        });
                        data.COLUMN.push("_CRUD");
                        data.VALUE.push("D");
                        updatable.ROWS.push(data);
                        request.DATA.OBJECTS.push(updatable);
                    }
                    break;
                case "GRID":
                    {
                        var updatable = {};
                        updatable.QUERY = $("#" + obj + "_data").attr("query");
                        updatable.ROWS = [];
                        var data = {
                            COLUMN: [],
                            VALUE: []
                        };
                        $.each(this.key, function (j) {
                            var row = this.row;
                            $.each(this.element, function (k) {
                                data.COLUMN.push(encodeURIComponent(this.name));
                                data.VALUE.push(
                                    encodeURIComponent(gw_com_api.getValue(obj, row, this.name, true))
                                );
                            });
                            data.COLUMN.push("_CRUD");
                            data.VALUE.push("D");
                            updatable.ROWS.push(data);
                        });
                        request.DATA.OBJECTS.push(updatable);
                    }
                    break;
            }
        });
        if (args.option != undefined) {
            $.each(args.option, function (i) {
                request.DATA.OPTION.NAME.push(encodeURIComponent(this.name));
                request.DATA.OPTION.VALUE.push(encodeURIComponent(this.value));
            });
        }
        return JSON.stringify(request);

    },

    // mask. (text)
    textMask: function (args) {

        $(args.targetobj).attr("mask", args.mask);
        switch (args.mask) {
            case "currency-ko":
                {
                    if (args.format != "ltr")
                        $(args.targetobj).attr("dir", "rtl");
                    $(args.targetobj).numeric();
                    $(args.targetobj).formatCurrency({ colorize: true, region: 'ko-KR' });
                    $(args.targetobj).blur(function () {
                        $(this).formatCurrency({ colorize: true, region: 'ko-KR' });
                    });
                    $(args.targetobj).change(function () {
                        $(this).formatCurrency({ colorize: true, region: 'ko-KR' });
                    });
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "numeric-int":
            case "currency-int":
                {
                    if (args.format != "ltr")
                        $(args.targetobj).attr("dir", "rtl");
                    $(args.targetobj).numeric();
                    $(args.targetobj).formatCurrency({ colorize: true, region: 'int' });
                    $(args.targetobj).blur(function () {
                        $(this).formatCurrency({ colorize: true, region: 'int' });
                    });
                    $(args.targetobj).change(function () {
                        $(this).formatCurrency({ colorize: true, region: 'int' });
                    });
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "numeric-float":
            case "currency-none":
            case "currency-float":
                {
                    if (args.format != "ltr")
                        $(args.targetobj).attr("dir", "rtl");
                    $(args.targetobj).numeric({ allow: "." });
                    $(args.targetobj).formatCurrency({ colorize: true, region: 'float' });
                    $(args.targetobj).blur(function () {
                        $(this).formatCurrency({ colorize: true, region: 'float' });
                    });
                    $(args.targetobj).change(function () {
                        $(this).formatCurrency({ colorize: true, region: 'float' });
                    });
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "numeric-float1":
                {
                    if (args.format != "ltr")
                        $(args.targetobj).attr("dir", "rtl");
                    $(args.targetobj).numeric({ allow: "." });
                    $(args.targetobj).formatCurrency({ colorize: true, region: 'float1' });
                    $(args.targetobj).blur(function () {
                        $(this).formatCurrency({ colorize: true, region: 'float1' });
                    });
                    $(args.targetobj).change(function () {
                        $(this).formatCurrency({ colorize: true, region: 'float1' });
                    });
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "numeric-float4":
                {
                    if (args.format != "ltr")
                        $(args.targetobj).attr("dir", "rtl");
                    $(args.targetobj).numeric({ allow: "." });
                    $(args.targetobj).formatCurrency({ colorize: true, region: 'float4' });
                    $(args.targetobj).blur(function () {
                        $(this).formatCurrency({ colorize: true, region: 'float4' });
                    });
                    $(args.targetobj).change(function () {
                        $(this).formatCurrency({ colorize: true, region: 'float4' });
                    });
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "date-ym":
                {
                    $(args.targetobj).inputmask("y-m");
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "date-ymd":
                {
                    $(args.targetobj).inputmask("y-m-d");
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "time-hh":
                {
                    $(args.targetobj).inputmask("h시");
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "time-hm":
                {
                    $(args.targetobj).inputmask("h:n");
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "biz-no":
                {
                    $(args.targetobj).inputmask("999-99-99999");
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "only-no":
                {
                    $(args.targetobj).inputmask("99999999999999999");
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "person-id":
                {
                    $(args.targetobj).inputmask("999999-9999999");
                    $(args.targetobj).css("ime-mode", "disabled");
                }
                break;
            case "search":
                {
                    switch (args.format) {
                        case "icon":
                            {
                                //$(args.targetobj).css('background', '#ffffff url(' + gw_com_api.getResource("ICON", "검색_2", "png") + ') right no-repeat');
                                $(args.targetobj).addClass("element_search");
                                //$(args.targetobj).addClass("error_highlight");
                            }
                            break;
                        case "button":
                            {
                                $(args.targetobj + "_search").click(function () {
                                    var e = $.Event("keypress");
                                    e.which = gw_com_api.v_Key.key_enter;
                                    $(args.targetobj).trigger(e);
                                });
                            }
                            break;
                    }
                    if (args.readonly) {
                        $(args.targetobj).attr("readonly", true);
                        $(args.targetobj).attr("noeditable", true);
                    }
                }
                break;
        }
        if (args.datepicker) {
            // 브라우저 호환성 적용 by JJJ at 2021.03.31
            if ($.browser.msie) {
                $(args.targetobj).datepicker({
                    dateFormat: 'yy-mm-dd',
                    showOn: 'button',
                    buttonImage: "../style/images/calendar.gif",
                    buttonImageOnly: true
                });
            }
            else {
                $(args.targetobj).datepicker({});
            }
        }

    },

    // unmask. (text)
    textunMask: function (args) {

        var cellvalue = $(args.targetobj).val();
        switch ($(args.targetobj).attr("mask")) {

            case "date-ym":
            case "date-ymd":
            case "biz-no":
            case "person-id":
                {
                    cellvalue = cellvalue.replace(/\_/g, "");
                    var value = cellvalue.split("-");
                    return value.join("");
                    //var format = "";
                    //$.each(value, function (i) {
                    //    format = format + this;
                    //});
                    //return format;
                }
            case "time-hh":
                {
                    var format = cellvalue.replace(/\_/g, "").replace("시", "");
                    return format;
                }
            case "time-hm":
                {
                    cellvalue = cellvalue.replace(/\_/g, "");
                    var value = cellvalue.split(":");
                    return value.join("");
                    //var format = "";
                    //$.each(value, function (i) {
                    //    format = format + this;
                    //});
                    //return format;
                }
            case "numeric-int":
            case "currency-ko":
            case "currency-int":
                {
                    return $(args.targetobj).asNumber({ parseType: 'int' });
                }
                break;
            case "numeric-float":
            case "numeric-float1":
            case "numeric-float4":
            case "currency-none":
            case "currency-float":
                {
                    return $(args.targetobj).asNumber({ parseType: 'float' });
                }
                break;
            default:
                return cellvalue;
        }

    },

    // set. (select)
    selectSet: function (args) {

        var len = args.request.length;
        var got = 0;
        $.each(args.request, function (set_i) {
            switch (this.type) {
                case "INLINE":
                    {
                        successRequest(this.type, this.name, this.data);
                    }
                    break;
                case "DATA":
                    {
                        var param = {
                            request: "FILE",
                            name: this.name,
                            url: this.url,
                            handler_success: successRequest,
                            handler_invalid: invalidRequest,
                            handler_error: errorRequest,
                            handler_complete: completeRequest
                        };
                        gw_com_module.callRequest(param);
                    }
                    break;
                case "PAGE":
                    {
                        var url =
                            ((args.url != undefined)
                                ? this.url : "../Service/svc_Retrieve_DATA.aspx");
                        var params = "?QRY_ID=" + this.query;
                        if (this.param != undefined) {
                            $.each(this.param, function (set_j) {
                                params = params + "&";
                                params = params +
                                    encodeURIComponent(this.argument) +
                                    "=" +
                                    encodeURIComponent(this.value);
                            });
                        }
                        var param = {
                            request: "DATA",
                            name: this.name,
                            url: url + params,
                            handler_success: successRequest,
                            handler_invalid: invalidRequest,
                            handler_error: errorRequest,
                            handler_complete: completeRequest
                        };
                        gw_com_module.callRequest(param);
                    }
                    break;
            }
        });

        function successRequest(type, name, response) {

            // Set Languages : by JJJ at 2020.01
            if (response.TITLE != undefined) {
                $.each(response.TITLE, function (i) {
                    response.TITLE[i] = gw_com_langs.getLangs(this);
                });
            }
            if (type == "INLINE") {
                $.each(response, function (i) {
                    response[i].title = gw_com_langs.getLangs(this.title);
                });
            }

            var code = { name: name, array: [] };
            if (type == "DATA") {
                $.each(response.TITLE, function (success_i) {
                    if (response.KEY.length > 0) {
                        code.array.push({
                            title: this,
                            value: response.VALUE[success_i],
                            key: response.KEY[success_i].DATA
                        });
                    }
                    else {
                        code.array.push({
                            title: this,
                            value: response.VALUE[success_i]
                        });
                    }
                });
            }
            else {
                code.array = response;
            }

            var find = null;
            $.grep(gw_com_module.v_Code, function (n, i) {
                if (n.name == code.name) {
                    find = i;
                }
            });

            if (find == null)
                gw_com_module.v_Code.push(code);
            else
                gw_com_module.v_Code[find] = code;

            if (args.handler_success != undefined)
                args.handler_success(response);

            if (++got == len) {
                if (args.starter != undefined)
                    args.starter();
            }

        }

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();

        };

        function completeRequest() {

            if (args.handler_complete != undefined)
                args.handler_complete();

        };

    },

    // get. (select)
    selectGet: function (args) {

        var select = [];
        $.each(this.v_Code, function (get_i) {
            if (this.name == args.name) {
                select = this.array;
                if (args.source != undefined) {
                    var filter = "";
                    $.each(args.source, function (get_j) {
                        id = "#" + this.id + "_" + this.element;
                        filter = filter + (get_j == 0) ? "" : " && ";
                        filter = filter + "(n.key[" + get_j + "] == '" + $(id).val() + "')";
                    });
                    select = $.grep(gw_com_module.v_Code[get_i].array, function (n, get_j) {
                        return eval(filter);
                    });
                }
                else if (args.key != undefined) {
                    var filter = "";
                    $.each(args.key, function (get_j) {
                        if (get_j > 0) filter = filter + " && ";
                        //filter = filter + ((get_j == 0) ? "" : " && ");
                        filter = filter + "(n.key[" + get_j + "] == '" + this + "')";
                    });
                    select = $.grep(gw_com_module.v_Code[get_i].array, function (n, get_j) {
                        return eval(filter);
                    });
                }
            }
        });
        return select;

    },

    // filter. (select)
    selectFilter: function (args) {

        var el = "#" + args.target.id + "_" + args.target.element;
        $(el + " option").remove();
        $.each(this.v_Code, function (filter_i) {
            if (this.name == args.name) {
                var filter = "";
                $.each(args.source, function (filter_j) {
                    id = "#" + this.id + "_" + this.element;
                    filter = filter + (filter_j == 0) ? "" : " && ";
                    filter = filter + "(n.key[" + filter_j + "].value == '" + $(id).val() + "')";
                });
                var select = $.grep(this.array, function (n, filter_j) {
                    return eval(filter);
                });
                if (args.target.unshift != undefined) {
                    $.each(args.target.unshift, function (filter_j) {
                        if ($.browser.msie)
                            $(el)[0].add(new Option(this.title, this.value));
                        else
                            $(el)[0].add(new Option(this.title, this.value), null);
                    });
                }
                $.each(select, function (filter_j) {
                    if ($.browser.msie)
                        $(el)[0].add(new Option(this.title, this.value));
                    else
                        $(el)[0].add(new Option(this.title, this.value), null);
                });
                if (args.target.push != undefined) {
                    $.each(args.target.push, function (filter_j) {
                        if ($.browser.msie)
                            $(el)[0].add(new Option(this.title, this.value));
                        else
                            $(el)[0].add(new Option(this.title, this.value), null);
                    });
                }
                if (args.target.value != undefined)
                    $(el).attr("value", args.target.value);
                if (args.target.trans)
                    $(el).jqTransRelist();
            }
        });

    },

    // transform. (select)
    selectTrans: function (args) {

        var targetobj = "#" + args.targetid;
        $.each(args.element, function (i) {
            var el = targetobj + "_" + this.name;
            $(el).val(this.value);
            $(el).jqTransReselect();
        });

    },

    // create. (menu by buttons)
    buttonMenu: function (args) {

        var targetobj = "#" + args.targetid;
        switch (args.type) {

            case "FREE":
                {
                    // Set Languages : by JJJ at 2020.01
                    gw_com_langs.setLangs("buttonMenu", args);

                    var content = "<table border='0' style='margin: 0; padding: 0;'><tr>";
                    $.each(args.element, function (i) {
                        if (gw_com_module.v_Current.iframe
                            && this.name == "닫기")
                            return;
                        if (gw_com_module.v_Option.authority.usable) {
                            if (gw_com_module.v_Option.authority.control == "R"
                                && (this.updatable || this.name == "추가" || this.name == "수정" || this.name == "삭제" || this.name == "저장" || this.name == "상신"))
                                return;
                        }
                        var eid = args.targetid + "_" + this.name;
                        if (this.act)
                            gw_com_module.v_Current.act = eid;
                        content = content +
                            "<td>" +
                            "<button" +
                            " type='button'" +
                            " id='" + eid + "'" +
                            " name='" + eid + "'" +
                            " class='workButton " + args.targetid + "_act'" +
                            ">" +
                            "<span><span><span style='color: #4f4f4f;'>" +
                            "<div style='float:left; padding-top: 2px; padding-left:12px;'>" +
                            "<img src='" +
                            gw_com_api.getResource(
                                "ICON",
                                (this.icon != undefined) ? this.icon : this.name,
                                "png") + "'" +
                            " />" +
                            "</div>" +
                            "<div style='float:left; padding-top: 6px; font-family: 굴림체; font-size: 9pt; color: #4f4f4f;'>" +
                            "&nbsp;" +
                            this.value +
                            "&nbsp;&nbsp;" +
                            "</div>" +
                            "</span></span></span>" +
                            "</button>" +
                            "</td>";
                    });
                    content = content +
                        "</tr></table>";
                    $(targetobj).html(content);
                    /*
                    $("." + args.targetid + "_act").click(function() {
                    gw_com_module.v_Current.act = this.id;
                    });
                    */
                }
                break;
            case "IMG":
                {
                    var content = "<table border='0' style='margin: 0; padding: 0;'><tr>";
                    $.each(args.element, function (i) {
                        if (gw_com_module.v_Current.iframe
                            && this.name == "닫기")
                            return;
                        if (gw_com_module.v_Option.authority.usable) {
                            if (gw_com_module.v_Option.authority.control == "R"
                                && (this.updatable || this.name == "추가" || this.name == "수정" || this.name == "삭제" || this.name == "저장" || this.name == "상신"))
                                return;
                        }
                        var eid = args.targetid + "_" + this.name;
                        if (this.act)
                            gw_com_module.v_Current.act = eid;
                        content = content +
                            "<td>" +
                            "<input type='image'" +
                            " src='" +
                            gw_com_api.getResource(
                                "BUTTON",
                                (this.icon != undefined) ? this.icon : this.name,
                                "png") + "'" +
                            " id='" + eid + "'" +
                            " name='" + eid + "'" +
                            " class='workButton " + args.targetid + "_act'" +
                            " />" +
                            "</td>";
                    });
                    content = content +
                        "</tr></table>";
                    $(targetobj).html(content);
                    /*
                    $("." + args.targetid + "_act").click(function() {
                    gw_com_module.v_Current.act = this.id;
                    });
                    */
                }
                break;

        }
        if (args.show == false)
            $(targetobj).hide();

        if (this.v_Current.loaded)
            this.informSize();

    },

    // create. (label)
    labelCreate: function (args) {

        var targetobj = "#" + args.targetid;
        var content = "";
        $.each(args.row, function () {
            if (this.element != undefined) {
                content = content + "<div style='margin-bottom:2px; margin-left: 10px;'>";
                $.each(this.element, function (i) {
                    content = content +
                        (i == 0 ? "" : "&nbsp;") +
                        "<span" +
                        " id='" + args.targetid + "_" + this.name + "'" +
                        " style='border-bottom: 1px solid #999999;" +
                        " color: " + ((this.color != undefined) ? this.color : "#000000") + ";" +
                        " font-family: Verdana, 굴림체;" +
                        " font-weight: normal;'>" +
                        "</span>";
                });
                content = content + "</div>";
            }
            else {
                content = content +
                    "<div style='margin-bottom:2px;'><span" +
                    " id='" + args.targetid + "_" + this.name + "'" +
                    " style='border-bottom: 1px solid #999999;" +
                    " margin-left: 10px;" +
                    " color: " + ((this.color != undefined) ? this.color : "#000000") + ";" +
                    " font-family: Verdana, 굴림체;" +
                    " font-weight: normal;'>" +
                    "</span></div>";
            }
        });
        $(targetobj).html(content);

    },

    // assign. (label)
    labelAssign: function (args) {

        // JJJ
        var targetobj = "#" + args.targetid;
        $.each(args.row, function (i) {
            $(targetobj + "_" + this.name).text(gw_com_langs.getLangs(this.value));
        });

    },

    // to JSON. (form)
    formtoJSON: function (args) {

        var params = new Object();
        var skip = ":submit, :reset, :image, [disabled], [readonly]";
        if (args.skip != undefined)
            skip = skip + args.skip;
        var targetobj = $("#" + args.targetid);
        var elements = $(targetobj + " :input").not(":radio").add(targetobj + " :radio[checked=true]").not(skip);
        $.each(elements, function (i) {
            var value = "";
            switch (this.type) {
                case "checkbox":
                    {
                        value = (this.checked) ? this.onval : this.offval;
                    }
                    break;
                default:
                    value = this.value;
            }
            params[this.name] = value;
        });
        var dataStr = JSON.stringify(params);
        return dataStr;

    },

    // to Serial. (form)
    formtoSerial: function (args) {

        var targetobj = "#" + args.targetid;
        return $(targetobj).serializeArray();

    },

    // to String. (form)
    formtoARG: function (args) {

        var params = "";
        var skip = ":submit, :reset, :image, [disabled], [readonly]";
        if (args.skip != undefined)
            skip = skip + args.skip;
        var targetobj = "#" + args.targetid;
        var elements = $(targetobj + " :input").not(":radio").add(targetobj + " :radio[checked=true]").not(skip);
        $.each(elements, function (i) {
            //params = params + ((i == 0) ? "?" : "&");
            var value = "";
            switch (this.type) {
                case "checkbox":
                    {
                        value = (this.checked) ? this.onval : this.offval;
                    }
                    break;
                default:
                    value = this.value;
            }
            params = params + "&";
            params = params + encodeURIComponent(this.name) + "=" + value;
        });
        return params;

    },


    // create. (form)
    formCreate: function (args) {

        var targetobj = "#" + args.targetid;
        if (gw_com_module.v_Option.authority.usable) {
            if (gw_com_module.v_Option.authority.control == "R" && args.editable != undefined)
                args.editable = undefined;
        }
        $(targetobj).attr("name", args.targetid);
        if (args.query != undefined)
            $(targetobj).attr("query", args.query);
        $.data($(targetobj)[0], "event", {});
        $(targetobj).submit(function () {
            //$("#" + $(this).attr("act")).click();
            return false;
        });

        // Set Languages : by JJJ at 2020.01
        gw_com_langs.setLangs("formCreate", args);

        var masks = [];
        var selects = [];
        switch (args.type) {

            case "FREE":
                {
                    //if (args.border)
                    //    $(targetobj).addClass("form_1");
                    var content =
                        "<table" +
                        " id='" + args.targetid + "_data'" +
                        " width='100%' border='0' cellspacing='0' cellpadding='0'" +
                        " style='margin:0; padding:0;" +
                        ((args.margin != undefined) ? " padding-right:" + args.margin + "px;" : "") +
                        ((args.margin_top != undefined) ? " padding-top:" + args.margin_top + "px;" : "") +
                        "'>" +
                        "<tr>" +
                        "<td" +
                        " align='" + ((args.align != undefined) ? args.align : "right") + "' valign='top'>";
                    content = content +
                        "<table" +
                        " border='" + ((args.border) ? 0 : 0) + "'" +
                        " cellspacing='2' cellpadding='2'" +
                        " class = '" + ((args.border) ? "form_1" : "") +
                        " style='margin-top:2px; table-layout:fixed; white-space:nowrap;" +
                        ((this.split) ? "border-bottom:1px solid #cccccc;" : "") + "'" +
                        ">";
                    var padding = ((args.padding != undefined) ? args.padding : 10) + "px";
                    $.each(args.content.row, function (i) {
                        content = content +
                            "<tr>" +
                            "<td align='" + ((this.align != undefined) ? this.align : "left") + "'" +
                            ((i < args.content.row.length - 1) ? " class='form_row'" : "") +
                            ">";
                        content = content +
                            "<table cellpadding=2 cellspacing=0><tr>";
                        $.each(this.element, function (j) {
                            var eid = args.targetid + "_" + this.name;
                            var elabel = (this.label != undefined) ? this.label.title : "";
                            var evalue = (this.value != undefined) ? this.value : "";
                            if (this.hidden) {
                                content = content +
                                    "<input" +
                                    " type='hidden'" +
                                    " id='" + eid + "'" +
                                    " name='" + this.name + "'" +
                                    " value='" + evalue + "'" +
                                    " label='" + elabel + "'" +
                                    " />";
                                return;
                            }
                            var efloat = (this.style != undefined && this.style.colfloat != undefined)
                                ? this.style.colfloat : "none";
                            if (this.label != undefined) {
                                content = content +
                                    "<td" +
                                    ((this.label.width != undefined)
                                        ? " width='" + this.label.width + "px'" : "") +
                                    " style='" + ((j == 0) ? "padding-left:" + padding : "") + "'" +
                                    ">" +
                                    "<div style='overflow:hidden;'>" +
                                    "<label>" +
                                    this.label.title +
                                    "</label>" +
                                    "</div>" +
                                    "</td>";
                            }
                            var etype = (this.format != undefined && this.format.type != undefined)
                                ? this.format.type : "";
                            switch (etype) {
                                case "button":
                                    {
                                        if (this.act) $(targetobj).attr("act", eid);
                                        content = content +
                                            "<td" +
                                            ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                            " align='" + ((this.align != undefined) ? this.align : "right") + "'" +
                                            " valign='middle'" +
                                            ">";
                                        if (this.show == false)
                                            content = content +
                                                "<div style='display:none;'>" +
                                                "<button class='hideButton' style='background: margin:0; margin-left:10px; padding:0;'" +
                                                " type='" + ((this.submit) ? "submit" : "button") + "'" +
                                                " id='" + eid + "'" +
                                                " name='" + eid + "'" +
                                                "></button>";
                                        else {
                                            content = content +
                                                "<div style='overflow:hidden;'>" +
                                                "<button class='workButton' style='margin:0; padding:0;'" +
                                                " type='" + ((this.submit) ? "submit" : "button") + "'" +
                                                " id='" + eid + "'" +
                                                " name='" + eid + "'" +
                                                ">" +
                                                "<span><span><span style='color: #4f4f4f;'>" +
                                                "<div style='float:left;" +
                                                ((evalue != "")
                                                    ? "padding-top: 2px; padding-left:12px;"
                                                    : "padding-top: 3px; padding-left:6px;") +
                                                "'>" +
                                                (this.format.noicon ? "" :
                                                    "<img src='" +
                                                    gw_com_api.getResource(
                                                        "ICON",
                                                        (this.format.icon != undefined) ? this.format.icon : this.name,
                                                        "png") + "'" +
                                                    " />") +
                                                "</div>" +
                                                "<div style='float:left; padding-top: 6px; font-family: 굴림체; font-size: 9pt; color: #4f4f4f;'>" +
                                                ((evalue != "") ? "&nbsp;" + evalue + "&nbsp;&nbsp;" : "&nbsp;") +
                                                "</div>" +
                                                "</span></span></span>" +
                                                "</button>";
                                        }
                                        content = content +
                                            "</div>" +
                                            "</td>";
                                    }
                                    break;
                            }
                            etype = (this.editable != undefined) ? this.editable.type : "";
                            var estyle = args.targetid + "_editchangable";
                            switch (etype) {
                                case "text":
                                    {
                                        var ewidth = (this.mask == "date-ymd") ? parseInt(padding) + 14 : parseInt(padding);
                                        content = content +
                                            "<td" +
                                            ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                            " align='" + ((this.align != undefined) ? this.align : "left") + "'" +
                                            " style='padding-right:" + ((efloat == "floating") ? ewidth - 8 : ewidth) + "px;'" +
                                            ">"; // +
                                        //"<div style='overflow:hidden;'>";
                                        content = content +
                                            "<input" +
                                            " type='" +
                                            ((this.encrypt) ? "password" : "text") + "'" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " label='" + elabel + "'" +
                                            " value='" + evalue + "'" +
                                            ((this.editable.size != undefined) ? " size='" + this.editable.size + "'" : "") +
                                            ((this.editable.maxlength != undefined) ? " maxlength='" + this.editable.maxlength + "'" : "") +
                                            ((this.editable.disable) ? " disabled=true" : "") +
                                            ((this.editable.readonly) ? " readonly=true" : "") +
                                            ((this.editable.keyword) ? " keyword=true" : "");
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            estyle = estyle +
                                                " {validate: { " + this.editable.validate.rule + " }}";
                                        }
                                        content = content +
                                            " class='" + estyle + "'";
                                        content = content +
                                            " style=''" +
                                            " />";
                                        if (args.trans && this.mask == "search") {
                                            content = content +
                                                "<button class='workButton' style='margin-top:4px;'" +
                                                " type='button'" +
                                                " id='" + eid + "_search'" +
                                                " name='" + eid + "_search'" +
                                                ">" +
                                                "<span><span><span style='color: #4f4f4f;'>" +
                                                "<img src='" +
                                                gw_com_api.getResource("ICON", "검색", "png") + "'" +
                                                " style='padding:3px;'" +
                                                " />" +
                                                "</span></span></span>" +
                                                "</button>";
                                        }

                                        content = content +
                                            //"</div>" +
                                            "</td>";
                                    }
                                    break;
                                case "texts":
                                    {
                                        var ewidth = (this.mask == "date-ymd") ? parseInt(padding) + 14 : parseInt(padding);
                                        content = content +
                                            "<td" +
                                            ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                            " align='" + ((this.align != undefined) ? this.align : "left") + "'" +
                                            " style='padding-right:" + ((efloat == "floating") ? ewidth - 8 : ewidth) + "px;'" +
                                            ">" +
                                            "<div style='overflow:hidden;'>";
                                        content = content +
                                            "<input" +
                                            " type='" +
                                            ((this.encrypt) ? "password" : "text") + "'" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " label='" + elabel + "'" +
                                            " value='" + evalue + "'" +
                                            ((this.editable.size != undefined) ? " size='" + this.editable.size + "'" : "") +
                                            ((this.editable.maxlength != undefined) ? " maxlength='" + this.editable.maxlength + "'" : "") +
                                            ((this.editable.disable) ? " disabled=true" : "") +
                                            ((this.editable.readonly) ? " readonly=true" : "") +
                                            ((this.editable.keyword) ? " keyword=true" : "");
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                            estyle = estyle +
                                                " {validate: { " + this.editable.validate.rule + " }}";
                                        }
                                        content = content +
                                            " class='" + estyle + "'";
                                        content = content +
                                            " style=''" +
                                            " />";
                                        if (args.trans && this.mask == "search") {
                                            content = content +
                                                "<button class='workButton' style='margin-top:4px;'" +
                                                " type='button'" +
                                                " id='" + eid + "_search'" +
                                                " name='" + eid + "_search'" +
                                                ">" +
                                                "<span><span><span style='color: #4f4f4f;'>" +
                                                "<img src='" +
                                                gw_com_api.getResource("ICON", "검색", "png") + "'" +
                                                " style='padding:3px;'" +
                                                " />" +
                                                "</span></span></span>" +
                                                "</button>";
                                        }
                                        content = content +
                                            "</div>";
                                        if (this.tip != undefined) {
                                            content = content +
                                                "<div style='margin-top:5px;" +
                                                ((this.tip.color != undefined) ? " color:" + this.tip.color + ";" : "") +
                                                "'>" +
                                                this.tip.text +
                                                "</div>"
                                        }
                                        content = content +
                                            "</td>";
                                    }
                                    break;
                                case "checkbox":
                                    {
                                        content = content +
                                            "<td" +
                                            ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                            " align='" + ((this.align != undefined) ? this.align : "left") + "'" +
                                            " style='padding-right:" + padding + ";'" +
                                            ">" +
                                            "<div style='overflow:hidden;'>";
                                        content = content +
                                            "<input" +
                                            " type='checkbox'" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " label='" + elabel + "'" +
                                            " value='" + ((this.editable.value == evalue) ? evalue : this.editable.offval) + "'" +
                                            " onval='" + this.editable.value + "'" +
                                            " offval='" + this.editable.offval + "'" +
                                            " text='" + this.title + "'" +
                                            ((this.editable.value == evalue) ? " checked=true" : "");
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                            estyle = estyle +
                                                " {validate: { " + this.editable.validate.rule + " }}";
                                        }
                                        content = content +
                                            " class='" + estyle + "'";
                                        content = content +
                                            " style='margin:0px 3px 1px 0px; vertical-align:-2px;'" +
                                            " />";
                                        content = content +
                                            "</div>" +
                                            "</td>";
                                    }
                                    break;
                                case "radio":
                                    {
                                        content = content +
                                            "<td" +
                                            ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                            " align='" + ((this.align != undefined) ? this.align : "left") + "'" +
                                            " style='padding-right:" + padding + ";'" +
                                            ">" +
                                            "<div style='overflow:hidden;'>";
                                        var ename = this.name;
                                        $.each(this.editable.child, function (j) {
                                            content = content +
                                                "<input" +
                                                " type='radio'" +
                                                " id='" + eid + "_" + j + "'" +
                                                " label='" + elabel + "'" +
                                                " name='" + ename + "'" +
                                                " value='" + this.value + "'" +
                                                " text='" + this.title + "'" +
                                                ((this.value == evalue) ? " checked=true" : "") +
                                                " style='" + ((args.trans) ? "" : "margin: 0px 3px 1px 0px; vertical-align: -2px;") + "'";
                                            content = content + " />" +
                                                "<span" +
                                                ((args.trans) ? " class='jqTransformRadioLabel'" : "") +
                                                " style='" + ((args.trans) ? "margin-top:5px;" : "margin-top:0px;") + "'>" +
                                                this.title +
                                                "</span>";
                                        });
                                        content = content +
                                            "<div style='display:none;'>" +
                                            "<input" +
                                            " type='text'" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " value='" + evalue + "'" +
                                            " readonly=true";
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                " class='{validate: { " + this.editable.validate.rule + " }}'" +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                        }
                                        content = content +
                                            " />" +
                                            "</div>";
                                        content = content +
                                            "</div>" +
                                            "</td>";
                                    }
                                    break;
                                case "select":
                                    {
                                        content = content +
                                            "<td" +
                                            ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                            " align='" + ((this.align != undefined) ? this.align : "left") + "'" +
                                            " style='padding-right:" + padding + ";'" +
                                            ">"// +
                                        //"<div style='overflow:hidden;'>";
                                        content = content +
                                            "<select" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " label='" + elabel + "'" +
                                            " size='" + ((this.editable.size != undefined) ? this.editable.size : 1) + "'";
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                            estyle = estyle +
                                                " {validate: { " + this.editable.validate.rule + " }}";
                                        }
                                        content = content +
                                            " class='" + estyle + "'";
                                        content = content +
                                            ">";
                                        content = content + "</select>";
                                        var param = {
                                            id: eid,
                                            value: evalue,
                                            data: this.editable.data
                                        }
                                        if (this.editable.change != undefined)
                                            param.change = this.editable.change;
                                        selects.push(param);
                                        content = content +
                                            //"</div>" +
                                            "</td>";
                                    }
                                    break;
                            }
                            // 브라우저 호환성 적용 by JJJ at 2021.03.31
                            if (this.mask != undefined) {
                                if ($.browser.msie) {
                                    masks.push({
                                        id: eid,
                                        rule: this.mask,
                                        readonly: false,
                                        format: "button",
                                        datepicker: (this.mask == "date-ymd" && etype != "hidden") ? true : false
                                    });
                                }
                                else {
                                    masks.push({
                                        id: eid,
                                        rule: this.mask,
                                        datepicker: (this.mask == "date-ymd" && etype != "hidden") ? true : false
                                    });
                                }
                            }
                        });
                        content = content +
                            "</tr></table>";
                        content = content +
                            "</td></tr>";
                    });
                    content = content +
                        "</table>";
                    content = content +
                        "</td></tr></table>";
                    $(targetobj).html(content);
                    $(targetobj).attr("title", args.title);
                    if (args.editable != undefined) {
                        $("." + args.targetid + "_editchangable").change(function () {
                            var current = "";
                            switch (this.type) {
                                case "checkbox":
                                    {
                                        current = $(this).attr("checked")
                                            ? $(this).attr("onval") : $(this).attr("offval");
                                    }
                                    break;
                                case "radio":
                                    {
                                        current = this.value;
                                        $(targetobj + "_" + this.name).val(current);
                                    }
                                    break;
                                default:
                                    current = this.value;
                            }
                            var event = $.data($(targetobj)[0], "event");
                            if (event.itemchanged != undefined) {
                                var param = {
                                    type: "FORM",
                                    object: args.targetid,
                                    row: 1,
                                    element: this.name,
                                    value: {
                                        prev: (this.type == "radio")
                                            ? $(targetobj + "_" + this.name + "_data").val()
                                            : $("#" + this.id + "_data").val(),
                                        current: current
                                    }
                                };
                                if (!event.itemchanged(param))
                                    return true;
                            }
                            ((this.type == "radio")
                                ? $(targetobj + "_" + this.name + "_data")
                                : $("#" + this.id + "_data"))
                                .val(current);
                            return true;
                        });
                        $("." + args.targetid + "_editchangable").dblclick(function () {
                            if (this.type == "text") {
                                var event = $.data($(targetobj)[0], "event");
                                if (event.itemdblclick != undefined) {
                                    var param = {
                                        type: "FORM",
                                        object: args.targetid,
                                        row: 1,
                                        element: this.name,
                                        value: this.value
                                    }
                                    event.itemdblclick(param);
                                }
                            }
                            return true;
                        });
                        $("." + args.targetid + "_editchangable").keypress(function (e) {
                            var event = $.data($(targetobj)[0], "event");
                            if (e.which == 13) {
                                if (event.itemkeyenter != undefined) {
                                    var param = {
                                        type: "FORM",
                                        object: args.targetid,
                                        row: 1,
                                        element: this.name,
                                        value: this.value
                                    }
                                    event.itemkeyenter(param);
                                    return false;
                                }
                                else
                                    $("#" + $(targetobj).attr("act")).click();
                            }
                            return true;
                        });
                    }
                }
                break;

            case "TABLE":
                {
                    $(targetobj).addClass("form_2");
                    var content =
                        "<div" +
                        " id='" + args.targetid + "_wrap'" +
                        " style='width:100%; margin:0; padding:0;'>" +
                        "<div" +
                        " id='" + args.targetid + "_obj'" +
                        " style='overflow:" + ((!args.scroll) ? "hidden" : "auto") + ";'>" +
                        "</div>" +
                        "</div>";
                    //if ($(targetobj + "_wrap").length > 0) $(targetobj).unwrap();
                    if ($(targetobj + "_wrap") == null || $(targetobj + "_wrap").length < 1)
                        $(targetobj).wrap(content);
                    var content =
                        "<table" +
                        " border='0' cellspacing='0' cellpadding='0'" +
                        " style='margin:0; padding:0;'>" +
                        "<tr>" +
                        "<td valign='top'>";
                    content = content +
                        "<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'>";
                    if (args.caption) {
                        content = content +
                            "<div class='ui-jqgrid-titlebar ui-widget-header ui-corner-top'>" +
                            "<span id='" + args.targetid + "_caption' class='ui-jqgrid-title'>" +
                            "◈ " + args.title +
                            "</span>" +
                            "</div>";
                    }
                    content = content +
                        "<table" +
                        " id='" + args.targetid + "_data'" +
                        " width='" + ((args.width != undefined) ? args.width : "100%") + "'" +
                        " border='0' cellspacing='0' cellpadding='0'" +
                        " style='margin:0; padding:0; table-layout:fixed;" +
                        ((args.fixed) ? "" : "white-space:nowrap;") + "'>";
                    var column = "";
                    var option = {};
                    var wlabel = (args.content.width != undefined
                        && args.content.width.label != undefined) ? args.content.width.label : 125;
                    var wfield = (args.content.width != undefined
                        && args.content.width.field != undefined) ? args.content.width.field : 175;
                    var height = (args.content.height != undefined) ? args.content.height : 27;
                    $.each(args.content.row, function (i) {
                        content = content +
                            "<tr" +
                            ((this.control) ? " control=true" : "") +
                            " style='height:" + ((this.height != undefined) ? this.height + "px;" : ((height == "100%") ? height + ";" : height + "px;")) +
                            ((this.control || this.hidden) ? " display:none;" : "") + "'" +
                            ">";
                        $.each(this.element, function (j) {
                            if (args.editable == undefined) this.editable = undefined;	// added by JJJ at 2012.09.20
                            var eid = args.targetid + "_" + this.name;
                            var evalue = (this.value != undefined) ? this.value : "";
                            var format = (this.format != undefined && this.format.type != undefined)
                                ? this.format.type : "text";
                            var edit = (this.editable != undefined) ? this.editable.type : false;
                            if (this.name != undefined && format != "label") {
                                column = column +
                                    ((column != "") ? "," : "") + encodeURIComponent(this.name);
                                option[this.name] = {};
                                option[this.name].format = format;
                                option[this.name].edit = edit;
                                option[this.name].mask = (this.mask != undefined) ? this.mask : "";
                            }
                            if (this.hidden) {
                                content = content +
                                    "<input" +
                                    " type='hidden'" +
                                    " id='" + eid + "'" +
                                    " name='" + this.name + "'" +
                                    " value='" + evalue + "'" +
                                    ((this.refer) ? " display=true" : "");
                                if (this.editable != undefined)
                                    content += " class='" + args.targetid + "_editchangable" + "'";
                                if (this.control != undefined) {
                                    switch (this.control.by) {
                                        case "DX":
                                            {
                                                content = content +
                                                    " control='" + this.control.id.name + "'";
                                                var control = {
                                                    by: this.control.by,
                                                    type: this.control.type,
                                                    id: this.control.id,
                                                    parent: args.targetid
                                                };
                                                gw_com_module.v_Control[this.control.id.name] = control;
                                                this.control.id.SetVisible(true);
                                            }
                                            break;
                                    }
                                }
                                content = content +
                                    " />";
                                return;
                            }
                            var efloat = (this.style != undefined && this.style.colfloat != undefined)
                                ? this.style.colfloat : "none";
                            if (efloat == "none" || efloat == "float" || efloat == "div") {
                                if (this.header) {
                                    content = content +
                                        "<td class='ui-th-column ui-th-ltr form_2-label'" +
                                        " width='" + wlabel + "px'";
                                }
                                else {
                                    content = content +
                                        "<td class='jqgrow ui-row-ltr form_2-content'" +
                                        //" width='" + wfield + ((wfield == "100%") ? "'" : "px'");
                                        " width='" + (this.width == undefined ? wfield + (wfield == "100%" ? "'" : "px'") : this.width + (this.width == "100%" ? "'" : "px'"))	// by K.W.Y 2014-04-02

                                }
                                content = content +
                                    ((this.style != undefined && this.style.colspan != undefined)
                                        ? " colspan='" + this.style.colspan + "'" : "") +
                                    ((this.style != undefined && this.style.rowspan != undefined)
                                        ? " rowspan='" + this.style.rowspan + "'" : "") +
                                    ">";
                                content = content +
                                    "<div" +
                                    ((this.editable != undefined) ? " editable=true" : " editable=false") +
                                    " style='overflow:hidden;'" +
                                    ">";
                            }
                            var wstyle = args.targetid + "_format";
                            switch (format) {
                                case "caption":
                                    {
                                        content = content +
                                            "<div class='ui-jqgrid-titlebar ui-widget-header ui-corner-top' align='left'>" +
                                            "<span class='ui-jqgrid-title'>" +
                                            "◈ " + evalue +
                                            "</span>" +
                                            "</div>";
                                    }
                                    break;
                                case "label":
                                    {
                                        content = content +
                                            "<label id='" + eid +
                                            "' style='" + ((efloat == "float" || efloat == "floating") ? "float:left; margin-top:4px; margin-right:2px;" : "") +
                                            " font-weight:" + ((this.format.font != undefined && this.format.font.bold) ? "bold" : "normal") + ";" +
                                            "'>" + evalue +
                                            "</label>";
                                    }
                                    break;
                                case "textarea":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            //" style='display:none;'" +
                                            ">";
                                        content = content +
                                            "<textarea" +
                                            " id='" + eid + "_view'" +
                                            " name='" + this.name + "'" +
                                            " rows='" + this.format.rows + "'" +
                                            " style='border:0; box-sizing:border-box; margin-top:5px; margin-bottom:6px;" +
                                            " width: 100%'; " +
                                            //" width:" + ((this.format.width != undefined)
                                            //            ? this.format.width : parseInt(wfield) - 10) + "px;'" +
                                            " readonly=true" +
                                            ((this.editable == undefined) ? " noeditable=true" : "") +
                                            " style='" +
                                            " width:" + ((this.format.width != undefined)
                                                ? this.format.width : parseInt(wfield) - 10) + "px;'" +
                                            " >" +
                                            evalue +
                                            "</textarea>";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                                case "checkbox":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='" +
                                            ((efloat == "float" || efloat == "floating") ? "float:left; margin-right:2px;" : "") +
                                            ((efloat == "div" || efloat == "diving") ? "margin-bottom:2px;" : "") +
                                            "display:none;" +
                                            "'" +
                                            ">";
                                        content = content +
                                            "<input" +
                                            " type='checkbox'" +
                                            " id='" + eid + "_view'" +
                                            " name='" + this.name + "'" +
                                            " value='" + evalue + "'" +
                                            " onval='" + this.format.value + "'" +
                                            " offval='" + this.format.offval + "'" +
                                            ((this.format.value == evalue) ? " checked=true" : "") +
                                            " style='margin:0px 3px 1px 0px; vertical-align:-2px;'" +
                                            " disabled=true" +
                                            ((this.editable == undefined) ? " noeditable=true" : "") +
                                            " />";
                                        content = content +
                                            "<span" +
                                            " id='" + eid + "_view_text'" +
                                            " style='padding-left:2px;'>" +
                                            this.format.title +
                                            "</span>";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                                case "select":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='display:none;'" +
                                            ">";
                                        content = content +
                                            "<select" +
                                            " id='" + eid + "_view'" +
                                            " name='" + this.name + "'" +
                                            " size = '" + ((this.format.size != undefined) ? this.format.size : 1) + "'" +
                                            " style='" +
                                            ((this.format.width != undefined || this.autowidth != false)
                                                ? (" width:" + ((this.format.width != undefined)
                                                    ? this.format.width : parseInt(wfield) - 4) + "px;'")
                                                : "'") +
                                            " disabled=true" +
                                            ((this.editable == undefined) ? " noeditable=true" : "") +
                                            ">" +
                                            "</select>";
                                        content = content +
                                            "</div>";
                                        var param = {
                                            id: eid + "_view",
                                            value: evalue,
                                            data: this.format.data
                                        }
                                        if (this.format.change != undefined)
                                            param.change = this.format.change;
                                        selects.push(param);
                                    }
                                    break;
                                case "text":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='" +
                                            ((efloat == "float" || efloat == "floating") ? "float:left; margin-right:2px;" : "") +
                                            ((efloat == "div" || efloat == "diving") ? "margin-bottom:2px;" : "") +
                                            "display:none;" +
                                            "'" +
                                            ">";
                                        content = content +
                                            "<input" +
                                            " type='" + ((this.encrypt) ? "password" : "text") + "'" +
                                            " id='" + eid + "_view'" +
                                            " name='" + this.name + "'" +
                                            " value='" + evalue + "'" +
                                            " style='border:0; margin-top:1px;" +
                                            " width:" +
                                            ((this.format != undefined && this.format.width != undefined)
                                                ? this.format.width : parseInt(wfield) - 10) + "px;" +
                                            " font-weight:" + (this.format != undefined && this.format.font != undefined && this.format.font.bold ? "bold" : "normal") + ";" +
                                            "'" +
                                            ((this.rtl) ? " dir=rtl" : "") +
                                            " readonly=true" +
                                            ((this.editable == undefined) ? " noeditable=true" : "");
                                        if (this.format != undefined && this.format.fix != undefined) {
                                            content = content +
                                                ((this.format.fix.wrap != undefined) ? " wrap='" + this.format.fix.wrap + "'" : "");
                                        }

                                        content = content +
                                            " />";

                                        //// 작동 안함 by JJJ
                                        //if (this.format != undefined && this.format.tailer != undefined) {
                                        //    content = content +
                                        //        "<label id='" + eid + "_tail'" +
                                        //        "' style='" + "float:right; margin-top:4px; margin-right:2px;" +
                                        //    "'>" + this.format.tailer +
                                        //    "</label>";
                                        //}

                                        // 입력단위 표시 : 2020.06.27 by JJJ
                                        if (this.unit != undefined)
                                            content = content
                                                //+ "<label id='" + eid + "_tail'"
                                                //+ "' style='" + "float:right; margin-top:4px; margin-right:2px;'>"
                                                + " " + this.unit
                                                //+ "</label>"
                                                ;

                                        content = content +
                                            "</div>";
                                    }
                                    break;
                                case "html":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='" +
                                            ((efloat == "float" || efloat == "floating") ? "float:left; margin-right:2px;" : "") +
                                            ((efloat == "div" || efloat == "diving") ? "margin-bottom:2px;" : "") +
                                            "display:none;" +
                                            "'" +
                                            ">";
                                        content = content +
                                            "<div" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " value='" + evalue + "'" +
                                            " type='html'" +
                                            " style='overflow-y:auto;" +
                                            ((this.format != undefined && this.format.height != undefined)
                                                ? " height:" + this.format.height + "px;" : "") +
                                            ((this.format != undefined && this.format.top != undefined)
                                                ? " margin-top:" + this.format.top + "px;" : "") +
                                            ((this.format != undefined && this.format.bottom != undefined)
                                                ? " margin-bottom:" + this.format.top + "px;" : "") +
                                            "'" +
                                            ((this.editable == undefined) ? " noeditable=true" : "") +
                                            ">" +
                                            "</div>";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                            }
                            var wstyle = args.targetid + "_edit";
                            var estyle = args.targetid + "_editchangable";
                            switch (edit) {
                                case "text":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='" +
                                            ((efloat == "float" || efloat == "floating") ? "float:left; margin-right:2px;" : "") +
                                            ((efloat == "div" || efloat == "diving") ? "margin-bottom:2px;" : "") +
                                            "display:none; border:0;" +
                                            "'" +
                                            ">";
                                        content = content +
                                            "<input" +
                                            " type='" + ((this.encrypt) ? "password" : "text") + "'" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " value='" + evalue + "'" +
                                            ((this.editable.placeholder != undefined) ? " placeholder='" + this.editable.placeholder + "'" : "") +
                                            ((this.editable.maxlength != undefined) ? " maxlength='" + this.editable.maxlength + "'" : "") +
                                            ((this.editable.readonly) ? " readonly=true noeditable=false" : "") +
                                            ((this.editable.disable) ? " disabled=true" : "") +
                                            ((this.display) ? " display=true" : "");
                                        if (this.editable.bind != undefined)
                                            estyle = estyle + " " + args.targetid + "_" + this.editable.bind;
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                            estyle = estyle +
                                                " {validate: { " + this.editable.validate.rule + " }}";
                                        }
                                        var ewidth = (this.editable.width != undefined)
                                            ? this.editable.width : parseInt(wfield) - 10;
                                        ewidth = (this.mask == "date-ymd") ? ewidth - 16 : ewidth;
                                        // 2020.06.05 by JJJ : border & height
                                        content = content +
                                            " style='margin-top:1px; border-width:1; border-style:solid; border-color:#f8f8f8; height:15px;" +
                                            " width:" + ewidth + "px;'" +
                                            " class='" + estyle + "'" +
                                            " />";
                                        content = content +
                                            "<input" +
                                            " type='hidden'" +
                                            " id='" + eid + "_data'" +
                                            " value='" + evalue + "'" +
                                            " disabled=true" +
                                            " data=true" +
                                            " />";
                                        // 입력단위 표시 : 2020.06.27 by JJJ
                                        if (this.unit != undefined)
                                            content = content + " " + this.unit;
                                        content = content + "</div>";
                                    }
                                    break;
                                case "textarea":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='display:none;'" +
                                            ">";
                                        content = content +
                                            "<textarea" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " rows='" + this.editable.rows + "'" +
                                            " cols='" + 100 + "'" +
                                            ((this.editable.placeholder != undefined) ? " placeholder='" + this.editable.placeholder + "'" : "") +
                                            ((this.editable.readonly) ? " readonly=true" : "") +
                                            ((this.editable.disable) ? " disabled=true" : "");
                                        if (this.editable.bind != undefined)
                                            estyle = estyle + " " + args.targetid + "_" + this.editable.bind;
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                            estyle = estyle +
                                                " {validate: { " + this.editable.validate.rule + " }}";
                                        }
                                        // 2020.06.05 by JJJ : border:0
                                        content = content +
                                            " style='box-sizing:border-box; margin-top:3px; margin-bottom:4px; border:0;" +
                                            " width: 100%;'" +
                                            //" width:" + ((this.editable.width != undefined)
                                            //                ? this.editable.width : parseInt(wfield) - 10) + "px;'" +
                                            " class='" + estyle + "'" +
                                            ">";
                                        content = content +
                                            evalue;
                                        content = content + "</textarea>";
                                        content = content +
                                            "<input" +
                                            " type='hidden'" +
                                            " id='" + eid + "_data'" +
                                            " value='" + evalue + "'" +
                                            " disabled=true" +
                                            " data=true" +
                                            " />";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                                case "checkbox":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='" +
                                            ((efloat == "float" || efloat == "floating") ? "float:left; margin-right:2px;" : "") +
                                            ((efloat == "div" || efloat == "diving") ? "margin-bottom:2px;" : "") +
                                            "display:none;" +
                                            "'" +
                                            ">";
                                        content = content +
                                            "<input" +
                                            " type='checkbox'" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " value='" + ((this.editable.value == evalue) ? evalue : this.editable.offval) + "'" +
                                            " onval='" + this.editable.value + "'" +
                                            " offval='" + this.editable.offval + "'" +
                                            ((this.editable.value == evalue) ? " checked=true" : "") +
                                            ((this.editable.readonly) ? " readonly=true" : "") +
                                            ((this.editable.disable) ? " disabled=true" : "") +
                                            ((this.display) ? " display=true" : "");
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                            estyle = estyle +
                                                " {validate: { " + this.editable.validate.rule + " }}";
                                        }
                                        content = content +
                                            " style='margin:0px 3px 1px 0px; vertical-align:-2px;'" +
                                            " class='" + estyle + "'" +
                                            " />";
                                        content = content +
                                            "<span" +
                                            " id='" + eid + "_text'" +
                                            " style='padding-left:2px;'>" +
                                            this.editable.title +
                                            "</span>";
                                        content = content +
                                            "<input" +
                                            " type='hidden'" +
                                            " id='" + eid + "_data'" +
                                            " value='" + evalue + "'" +
                                            " disabled=true" +
                                            " data=true" +
                                            " />";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                                case "radio":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='display:none;'" +
                                            ">";
                                        var ename = this.name;
                                        $.each(this.editable.child, function (j) {
                                            var num = j + 1;
                                            content = content +
                                                "<input" +
                                                " type='radio'" +
                                                " id='" + eid + "_" + num + "'" +
                                                " name='" + ename + "'" +
                                                " value='" + this.value + "'" +
                                                " text='" + this.title + "'" +
                                                ((this.value == evalue) ? " checked=true" : " checked=false") +
                                                " style='margin: 0px 3px 1px 0px; vertical-align: -2px;'" +
                                                " class='" + estyle + "'" +
                                                " />";
                                            content = content +
                                                "<span" +
                                                " id='" + eid + "_" + num + "_text'" +
                                                " style='padding-right:10px;'>" +
                                                this.title +
                                                "</span>";
                                        });
                                        content = content +
                                            "<input" +
                                            " type='text'" +
                                            " radio=true" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " value='" + evalue + "'" +
                                            " readonly=true";
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                " class='{validate: { " + this.editable.validate.rule + " }}'" +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                        }
                                        content = content +
                                            " style='display:none;'" +
                                            " />";
                                        content = content +
                                            "<input" +
                                            " type='hidden'" +
                                            " id='" + eid + "_data'" +
                                            " value='" + evalue + "'" +
                                            " disabled=true" +
                                            " data=true" +
                                            " />";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                                case "select":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='" +
                                            ((efloat == "float" || efloat == "floating") ? "float:left; margin-right:8px;" : "") +
                                            ((efloat == "div" || efloat == "diving") ? "margin-bottom:2px;" : "") +
                                            "display:none;" +
                                            "'" +
                                            ">";
                                        content = content +
                                            "<select" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " size='" + ((this.editable.size != undefined) ? this.editable.size : 1) + "'" +
                                            ((this.editable.readonly) ? " readonly=true" : "") +
                                            ((this.editable.disable) ? " disabled=true" : "") +
                                            ((this.display) ? " display=true" : "");
                                        if (this.editable.bind != undefined)
                                            estyle = estyle + " " + args.targetid + "_" + this.editable.bind;
                                        if (this.editable.validate != undefined) {
                                            content = content +
                                                (this.editable.validate.message == undefined ? "" : " title='" + this.editable.validate.message + "'");
                                            //" title='" + this.editable.validate.message + "'";
                                            estyle = estyle +
                                                " {validate: { " + this.editable.validate.rule + " }}";
                                        }
                                        // 2020.06.05 by JJJ : border & height
                                        content = content +
                                            " style='border-color:#f8f8f8; height:17px; " +
                                            ((efloat == "float" || efloat == "floating" || efloat == "floated") ? " margin-top: 2px;" : "") +
                                            ((this.editable.width != undefined || this.autowidth != false)
                                                ? (" width:" + ((this.editable.width != undefined)
                                                    ? this.editable.width : parseInt(wfield) - 4) + "px;'")
                                                : "'") +
                                            " class='" + estyle + "'" +
                                            ">";
                                        content = content + "</select>";
                                        content = content +
                                            "<input" +
                                            " type='hidden'" +
                                            " id='" + eid + "_data'" +
                                            " value='" + evalue + "'" +
                                            " disabled=true" +
                                            " data=true" +
                                            " />";
                                        content = content +
                                            "</div>";
                                        var param = {
                                            id: eid,
                                            value: evalue,
                                            data: this.editable.data
                                        }
                                        if (this.editable.change != undefined)
                                            param.change = this.editable.change;
                                        selects.push(param);
                                    }
                                    break;
                                case "hidden":
                                    {
                                        content = content +
                                            "<div" +
                                            " class='" + wstyle + "'" +
                                            " style='" +
                                            ((efloat == "float" || efloat == "floating") ? "float:left; margin-right:2px;" : "") +
                                            ((efloat == "div" || efloat == "diving") ? "margin-bottom:2px;" : "") +
                                            "display:none;" +
                                            "'" +
                                            ">";
                                        content = content +
                                            "<input" +
                                            " type='text'" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " value='" + evalue + "'";
                                        var ewidth = (this.editable.width != undefined)
                                            ? this.editable.width : parseInt(wfield) - 10;
                                        content = content +
                                            " style='border:0; margin-top:1px; width:" + ewidth + "px;" +
                                            " font-weight:" + (this.format != undefined && this.format.font != undefined && this.format.font.bold ? "bold" : "normal") + ";" +
                                            "'" +
                                            " readonly=true" +
                                            " noeditable=false" +
                                            ((this.display) ? " display=true" : "") +
                                            " class='" + estyle + "'" +
                                            " />";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                            }
                            if (this.mask != undefined) {
                                if (this.editable != undefined)
                                    masks.push({
                                        id: eid,
                                        rule: this.mask,
                                        readonly: (this.mask == "search" && this.editable.readonly != false) ? true : false,
                                        format: "icon",
                                        datepicker: (this.mask == "date-ymd" && this.editable.type != "hidden") ? true : false
                                    });
                                else
                                    masks.push({
                                        id: eid + "_view",
                                        rule: this.mask,
                                        format: "ltr"
                                    });
                            }
                            if (efloat == "none" || efloat == "floated" || efloat == "divided") {
                                content = content +
                                    "</div>" +
                                    "</td>";
                            }
                        });
                        content = content + "</tr>";
                    });
                    option["_CRUD"] = {
                        format: "text",
                        edit: "text"
                    }
                    content = content + "<input type='hidden' id='" + args.targetid + "_CRUD' name='_CRUD' value='' />";
                    content = content + "</table></div>";
                    content = content + "</td></tr></table>";
                    $(targetobj).html(content);

                    $(targetobj).attr("title", args.title);
                    $(targetobj).attr("process", "none");
                    if (args.editable != undefined) {
                        if (args.editable.bind != undefined
                            && args.editable.bind == "select") {
                            $(targetobj).click(function () {
                                if ($(this).attr("process") == "format") {
                                    var param = {
                                        targetid: args.targetid,
                                        edit: true
                                    };
                                    gw_com_module.formEdit(param);
                                }
                            });
                        }
                        //-- by murphy (19.11)
                        else if (args.editable.bind != undefined) {
                            $(targetobj).click(function () {
                                if (gw_com_api.getValue(args.targetid, 1, args.editable.bind) != "0") {
                                    if ($(this).attr("process") == "format") {
                                        var param = {
                                            targetid: args.targetid,
                                            edit: true
                                        };
                                        gw_com_module.formEdit(param);
                                    }
                                }
                            });
                        }
                        //--
                        $("." + args.targetid + "_editchangable").change(function () {
                            var crud = $(targetobj + "_CRUD");
                            if (crud.val() == "R")
                                crud.val("U");
                            else if (crud.val() == "I")
                                crud.val("C");
                            var current = "";
                            switch (this.type) {
                                case "checkbox":
                                    {
                                        current = $(this).attr("checked") ? $(this).attr("onval") : $(this).attr("offval");
                                    }
                                    break;
                                case "radio":
                                    {
                                        current = this.value;
                                        $(targetobj + "_" + this.name).val(current);
                                    }
                                    break;
                                default:
                                    current = this.value;
                            }
                            var event = $.data($(targetobj)[0], "event");
                            if (event.itemchanged != undefined) {
                                var param = {
                                    type: "FORM",
                                    object: args.targetid,
                                    row: 1,
                                    element: this.name,
                                    value: {
                                        prev: (this.type == "radio")
                                            ? $(targetobj + "_" + this.name + "_data").val()
                                            : $("#" + this.id + "_data").val(),
                                        current: current
                                    }
                                };
                                if (!event.itemchanged(param))
                                    return true;
                            }
                            ((this.type == "radio")
                                ? $(targetobj + "_" + this.name + "_data")
                                : $("#" + this.id + "_data"))
                                .val(current);
                            return true;
                        });
                        $("." + args.targetid + "_editchangable").dblclick(function () {
                            if (this.type == "text" || this.type == "textarea") {
                                var event = $.data($(targetobj)[0], "event");
                                if (event.itemdblclick != undefined) {
                                    var param = {
                                        type: "FORM", object: args.targetid, row: 1, element: this.name, value: this.value
                                    }
                                    event.itemdblclick(param);
                                }
                            }
                            return true;
                        });
                        $("." + args.targetid + "_editchangable").keypress(function (e) {
                            if (this.type == "text") {
                                var event = $.data($(targetobj)[0], "event");
                                if (e.which == 13
                                    && event.itemkeyenter != undefined) {
                                    var param = {
                                        type: "FORM",
                                        object: args.targetid,
                                        row: 1,
                                        element: this.name,
                                        value: this.value
                                    }
                                    event.itemkeyenter(param);
                                    return false;
                                }
                            }
                            return true;
                        });
                    }
                    // itemdblclick Event for text, textarea, html
                    $(targetobj + " [noeditable]").dblclick(function () {
                        var event = $.data($(targetobj)[0], "event");
                        if (event.itemdblclick != undefined) {
                            var elemetName = this.name;
                            if (elemetName == undefined) elemetName = $("#" + this.id).attr("name");
                            var param = {
                                type: "FORM", object: args.targetid, row: 1, element: elemetName, value: this.value
                            }
                            event.itemdblclick(param);
                        }
                        return true;
                    });
                    var obj = {
                        column: column, option: option,
                        buffer: { insert: [], remove: [] },
                        current: null
                    };
                    gw_com_module.v_Object[args.targetid] = obj;
                }
                break;

            case "REPORT":
                {
                    $(targetobj).addClass("form_2");
                    var content =
                        "<div" +
                        " id='" + args.targetid + "_wrap'" +
                        " style='width:100%; margin:0; padding:0;'>" +
                        "<div" +
                        " id='" + args.targetid + "_obj'" +
                        "</div>" +
                        "</div>";
                    $(targetobj).wrap(content);
                    var content =
                        "<table" +
                        " border='0' cellspacing='0' cellpadding='0'" +
                        " style='margin:0; padding:0;'>" +
                        "<tr>" +
                        "<td valign='top'>";
                    content = content +
                        "<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'>";
                    if (args.caption) {
                        content = content +
                            "<div class='ui-jqgrid-titlebar ui-widget-header ui-corner-top'>" +
                            "<span class='ui-jqgrid-title'>" +
                            "◈ " + args.title +
                            "</span>" +
                            "</div>";
                    }
                    var cols = (args.content.cols != undefined) ? args.content.cols : 45;
                    var width = (args.content.width != undefined) ? args.content.width : 15;
                    content = content +
                        "<table" +
                        " id='" + args.targetid + "_data'" +
                        " width='" + ((args.width != undefined) ? args.width : "100%") + "'" +
                        " border='0' cellspacing='0' cellpadding='0' cols='" + cols + "'" +
                        " style='margin:0; padding:0; table-layout:fixed; white-space:nowrap;'>";
                    content = content +
                        "<colgroup>";
                    for (var col = 0; col < cols; col++)
                        content = content +
                            "<col width='" + width + "'>";
                    content = content +
                        "</colgroup>";
                    var height = (args.content.height != undefined) ? args.content.height : 25;
                    $.each(args.content.row, function (i) {
                        content = content +
                            "<tr" +
                            " style='height:" + height + "px;'" +
                            ">";
                        $.each(this.element, function (j) {
                            var eid = args.targetid + "_" + this.name;
                            var evalue = (this.value != undefined) ? this.value : "";
                            if (this.header)
                                content = content +
                                    "<td class='ui-th-column ui-th-ltr form_2-label'";
                            else
                                content = content +
                                    "<td class='jqgrow ui-row-ltr form_2-content'";
                            content = content +
                                ((this.cols != undefined) ? " colspan='" + this.cols + "'" : "") +
                                ((this.rows != undefined) ? " rowspan='" + this.rows + "'" : "") +
                                ">";
                            content = content +
                                "<div" +
                                " style='overflow:hidden;'" +
                                ">";
                            switch (this.type) {
                                case "label":
                                    {
                                        content = content +
                                            "<span" +
                                            " style='" +
                                            " font-family:" +
                                            ((this.font != undefined && this.font.family != undefined)
                                                ? this.font.family : "맑은 고딕") + ";" +
                                            " font-size:" +
                                            ((this.font != undefined && this.font.size != undefined)
                                                ? this.font.size : 12) + "pt;" +
                                            " font-weight:" +
                                            ((this.font != undefined && this.font.bold) ? "bold" : "normal") + ";" +
                                            "'" +
                                            ">" +
                                            evalue
                                        "</span>";
                                    }
                                    break;
                                case "textarea":
                                    {
                                        content = content +
                                            "<div" +
                                            ">";
                                        content = content +
                                            "<textarea" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " rows='" + this.rows + "'" +
                                            " style='border:0; margin-top:5px; margin-bottom:6px;" +
                                            " font-family:" +
                                            ((this.font != undefined && this.font.family != undefined)
                                                ? this.font.family : "맑은 고딕") + ";" +
                                            " font-size:" +
                                            ((this.font != undefined && this.font.size != undefined)
                                                ? this.font.size : 12) + "pt;" +
                                            " font-weight:" +
                                            ((this.font != undefined && this.font.bold) ? "bold" : "normal") + ";" +
                                            "'" +
                                            " readonly=true" +
                                            ((this.editable) ? " noeditable=true" : "") +
                                            " >" +
                                            evalue +
                                            "</textarea>";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                                default:
                                    {
                                        content = content +
                                            "<div" +
                                            ">";
                                        content = content +
                                            "<input" +
                                            " type='text'" +
                                            " id='" + eid + "'" +
                                            " name='" + this.name + "'" +
                                            " value='" + evalue + "'" +
                                            " style='border:0; margin-top:1px; box-sizing:border-box;" +
                                            ((this.align != undefined) ? " text-align:" + this.align + ";" : "") +
                                            " font-family:" +
                                            ((this.font != undefined && this.font.family != undefined)
                                                ? this.font.family : "맑은 고딕") + ";" +
                                            " font-size:" +
                                            ((this.font != undefined && this.font.size != undefined)
                                                ? this.font.size : 12) + "pt;" +
                                            " font-weight:" +
                                            ((this.font != undefined && this.font.bold) ? "bold" : "normal") + ";" +
                                            //" width:" + ((this.cols == undefined ? 1 : this.cols) * width) + "px;" +
                                            " width: 100%;" +
                                            "'" +
                                            " readonly=true" +
                                            ((this.editable) ? " noeditable=true" : "") +
                                            " />";
                                        content = content +
                                            "</div>";
                                    }
                                    break;
                            }
                            content = content +
                                "</div>" +
                                "</td>";
                        });
                        content = content + "</tr>";
                    });
                    content = content + "</table></div>";
                    content = content + "</td></tr></table>";
                    $(targetobj).html(content);
                    $(targetobj).attr("title", args.title);
                }
                break;

        }
        if (args.trans) {
            $(targetobj).jqTransform();
        }
        $.each(masks, function (ii) {
            var el = "#" + this.id;
            var param = {
                targetobj: el,
                mask: this.rule,
                readonly: this.readonly,
                format: this.format,
                datepicker: this.datepicker
            };
            gw_com_module.textMask(param);
        });
        $.each(selects, function (i) {
            var el = "#" + this.id;
            var evalue = this.value;
            if (!this.data.empty) {
                if (this.data.memory != undefined) {
                    var param = {
                        name: this.data.memory
                    };
                    data = gw_com_module.selectGet(param);
                }
                else
                    data = this.data;
                if (this.data.unshift != undefined) {
                    $.each(this.data.unshift, function (j) {
                        if ($.browser.msie)
                            $(el)[0].add(new Option(this.title, this.value));
                        else
                            $(el)[0].add(new Option(this.title, this.value), null);
                    });
                }
                if (this.data.key == undefined) {
                    $.each(data, function (j) {
                        if ($.browser.msie)
                            $(el)[0].add(new Option(this.title, this.value));
                        else
                            $(el)[0].add(new Option(this.title, this.value), null);
                    });
                }
                if (this.data.push != undefined) {
                    $.each(this.data.push, function (j) {
                        if ($.browser.msie)
                            $(el)[0].add(new Option(this.title, this.value));
                        else
                            $(el)[0].add(new Option(this.title, this.value), null);
                    });
                }
                if ($(el)[0].length > 0)
                    $(el).attr("value", $(el)[0][0].value);
                else
                    $(el).attr("value", evalue);

                $(el).change(function () {
                    if (selects[i].change != undefined) {
                        //$.each(selects[i].change, function (i) {
                        $.each(selects[i].change, function () {
                            var filter = [];
                            $.each(this.key, function (j) {
                                filter.push($(targetobj + "_" + this).val());
                            });
                            var param = {
                                name: this.memory,
                                key: filter
                            };
                            data = gw_com_module.selectGet(param);
                            var target = targetobj + "_" + this.name;
                            $(target + " option").remove();
                            if (this.unshift != undefined) {
                                $.each(this.unshift, function (j) {
                                    if ($.browser.msie)
                                        $(target)[0].add(new Option(this.title, this.value));
                                    else
                                        $(target)[0].add(new Option(this.title, this.value), null);
                                });
                            }
                            $.each(data, function (j) {
                                if ($.browser.msie)
                                    $(target)[0].add(new Option(this.title, this.value));
                                else
                                    $(target)[0].add(new Option(this.title, this.value), null);
                            });
                            if (this.push != undefined) {
                                $.each(this.push, function (j) {
                                    if ($.browser.msie)
                                        $(target)[0].add(new Option(this.title, this.value));
                                    else
                                        $(target)[0].add(new Option(this.title, this.value), null);
                                });
                            }
                            if (args.trans)
                                $(target).jqTransRelist();
                        });
                    }
                });
            }
            if (this.data.memory != undefined) {
                if (this.data.key != undefined) {
                    $(el).data({ memory: this.data.memory, key: this.data.key });
                }
            }
            if (args.trans)
                $(el).jqTransLists(i);
        });
        /*
        for (var i = selects.length - 1; i >= 0; i--) {
        if (args.trans)
        $("#" + selects[i].id).jqTransLists();
        }
        */
        if (args.show == true) {
            $(targetobj).show();
        }
        else
            $(targetobj).hide();
        if (args.editable != undefined) {
            if (args.editable.focus != undefined) {
                $(targetobj).attr("focus", args.editable.focus);
            }
            if (args.editable.validate) {
                $(targetobj).validate({
                    meta: "validate",
                    onkeyup: false,
                    onclick: false,
                    focusInvalid: false,
                    focusCleanup: false,
                    onfocusout: false,
                    ignoreTitle: true,
                    unhighlight: function (element, errorClass) {
                        if (args.trans) {
                            var $wrapper = $(element).parent().parent().parent();
                            $wrapper.removeClass("jqTransformInputWrapper_error");
                        }
                        else
                            $(element).removeClass("error_highlight");
                    },
                    showErrors: function (errorMap, errorList) {
                        if (errorList.length > 0) {
                            var msg = "* 입력 오류 *\n\n";
                            $.each(errorList, function (i) {
                                msg = msg + errorList[i].element.title + " - " + errorList[i].message + "\n";
                                if (errorList[i].element.radio) {
                                    var radio = $(targetobj + " :radio[name='" + errorList[i].element.name + "']");
                                    $.each(radio, function (j) {
                                        if (args.trans) {
                                            var $wrapper = $(this).parent().parent().parent();
                                            $wrapper.addClass("jqTransformInputWrapper_error");
                                        }
                                        else
                                            $(this).addClass("error_highlight");
                                    });
                                }
                                else {
                                    if (args.trans) {
                                        var $wrapper = $(errorList[i].element).parent().parent().parent();
                                        $wrapper.addClass("jqTransformInputWrapper_error");
                                    }
                                    else
                                        $(errorList[i].element).addClass("error_highlight");
                                }
                            });
                            if (gw_com_module.v_Option.message) {
                                var message = [
                                    { text: "NOVALIDATE" }
                                ];
                                if (args.title != undefined)
                                    message.unshift({ text: "◈ " + args.title + "<br><br>", align: "left", margin: 30 });
                                gw_com_api.messageBox(message);
                            }
                            else
                                gw_com_api.showMessage(msg);
                            if (args.type == "FREE")
                                $(targetobj).show();
                            $("#" + errorList[0].element.id).focus();
                        }
                    }
                });
            }
        }
        if (args.remark != undefined) {
            var remark = (args.remark.id != undefined) ? args.remark.id : args.remark;
            $(targetobj).attr("remark", remark);
            $("#" + remark).html(
                "<table border=0 cellpadding=0 cellspacing=0 style='padding:0; margin-bottom:2px; margin-right:10px;" +
                " margin-left: " + ((args.remark.margin != undefined) ? args.remark.margin + "px" : "10px") + ";" +
                "'>" +
                "<tr><td><span" +
                " id='" + remark + "_data'" +
                " style='border-bottom: 1px solid #999999;" +
                " color: #000000;" +
                " font-family: Verdana, 굴림체;" +
                " font-weight: normal;'>" +
                "</span></td></tr>" +
                "</table>"
                /*
                "<div style='margin-bottom:2px;'><span" +
                " id='" + remark + "_data'" +
                " style='border-bottom: 1px solid #999999;" +
                " margin-left: " + ((args.remark.margin != undefined) ? args.remark.margin + "px" : "10px") + ";" +
                " color: #000000;" +
                " font-family: Verdana, 굴림체;" +
                " font-weight: normal;'>" +
                "</span></div>"
                */
            );
        }
        var wrapperobj = "#" + args.targetid + "_obj";
        $(wrapperobj).addClass("selectedlayer");
        if (args.selectable) {
            /*
            $(wrapperobj).click(function(i) {
            if (gw_com_module.v_Current.object != null
            && gw_com_module.v_Current.object != args.targetid)
            $("#" + gw_com_module.v_Current.object + "_obj").css("border-color", "#ffffff");
            //$("#" + gw_com_module.v_Current.object + "_obj").removeClass("selectedlayer");
            gw_com_module.v_Current.object = args.targetid;
            $("#" + gw_com_module.v_Current.object + "_obj").css("border-color", "#b1b1cc");
            //$(wrapperobj).addClass("selectedlayer");
            });
            */
        }

        if (this.v_Current.loaded)
            this.informSize();

    },

    // transform. (form)
    formTrans: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).jqTransform();
        if (args.show == true) {
            $(targetobj).show();
            if (args.focus != undefined)
                $(targetobj).attr("focus", args.editable.focus);
        }
        else
            $(targetobj).hide();

        if (this.v_Current.loaded)
            this.informSize();

    },

    // create. (html)
    htmlCreate: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).attr("html", true);
        $(targetobj).attr("name", args.targetid);
        if (args.query != undefined)
            $(targetobj).attr("query", args.query);
        $.data($(targetobj)[0], "event", {});
        $(targetobj).submit(function () {
            //$("#" + $(this).attr("act")).click();
            return false;
        });

        //$(targetobj).addClass("form_2");
        var content =
            "<div" +
            " id='" + args.targetid + "_wrap'" +
            " style='width:100%; margin:0; padding:0;'>" +
            /*
            "<div" +
            " id='" + args.targetid + "_obj'" +
            " style='overflow:" + ((!args.scroll) ? "hidden" : "auto") + ";'>" +
            "</div>" +
            */
            "</div>";
        //$(targetobj).wrap(content);
        var content =
            "<table" +
            " border='0' cellspacing='0' cellpadding='0'" +
            " style='margin:0; padding:0;'>" +
            "<tr>" +
            "<td valign='top'>";
        content = content +
            "<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'>";
        if (args.caption) {
            content = content +
                "<div class='ui-jqgrid-titlebar ui-widget-header ui-corner-top'>" +
                "<span class='ui-jqgrid-title'>" +
                "◈ " + args.title +
                "</span>" +
                "</div>";
        }
        var content =
            "<div align='center' style='background-color:Gray;'>" +
            "<table border='1' cellspacing='0' cellpadding='0' style='margin: 0; padding: 0;'>";

        var column = "";
        $.each(args.content.row, function (i) {
            content = content +
                "<tr>";
            $.each(this.element, function (j) {
                var eid = args.targetid + "_" + this.name;
                content = content +
                    "<td valign='middle'>" +
                    "<div" +
                    " id='" + eid + "'" +
                    " container = true" +
                    ">" +
                    "</td>";
                column = column +
                    ((column != "") ? "," : "") + encodeURIComponent(this.name);
            });
            content = content +
                "</tr>";
        });
        content = content +
            "</table>" +
            "</div>";
        $(targetobj).html(content);
        $(targetobj).attr("title", args.title);

        var obj = {
            column: column
        };
        gw_com_module.v_Object[args.targetid] = obj;

        if (args.show == true) {
            $(targetobj).show();
        }
        else
            $(targetobj).hide();
        var wrapperobj = "#" + args.targetid + "_obj";
        $(wrapperobj).addClass("selectedlayer");
        if (args.selectable) {
            /*
            $(wrapperobj).click(function(i) {
            if (gw_com_module.v_Current.object != null
            && gw_com_module.v_Current.object != args.targetid)
            $("#" + gw_com_module.v_Current.object + "_obj").css("border-color", "#ffffff");
            //$("#" + gw_com_module.v_Current.object + "_obj").removeClass("selectedlayer");
            gw_com_module.v_Current.object = args.targetid;
            $("#" + gw_com_module.v_Current.object + "_obj").css("border-color", "#b1b1cc");
            //$(wrapperobj).addClass("selectedlayer");
            });
            */
        }

        if (this.v_Current.loaded)
            this.informSize();

    },

    // set validator. (form)
    formValidator: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).validate({
            meta: "validate",
            onkeyup: false,
            onclick: false,
            focusInvalid: false,
            focusCleanup: false,
            onfocusout: false,
            ignoreTitle: true,
            unhighlight: function (element, errorClass) {
                if (args.trans) {
                    var $wrapper = $(element).parent().parent().parent();
                    $wrapper.removeClass("jqTransformInputWrapper_error");
                }
                else
                    $(element).removeClass("error_highlight");
            },
            showErrors: function (errorMap, errorList) {
                if (errorList.length > 0) {
                    var msg = "* 입력 오류 *\n\n";
                    $.each(errorList, function (i) {
                        msg = msg + errorList[i].element.title + " - " + errorList[i].message + "\n";
                        if (errorList[i].element.radio) {
                            var radio = $(targetobj + " :radio[name='" + errorList[i].element.name + "']");
                            $.each(radio, function (j) {
                                if (args.trans) {
                                    var $wrapper = $(this).parent().parent().parent();
                                    $wrapper.addClass("jqTransformInputWrapper_error");
                                }
                                else
                                    $(this).addClass("error_highlight");
                            });
                        }
                        else {
                            if (args.trans) {
                                var $wrapper = $(errorList[i].element).parent().parent().parent();
                                $wrapper.addClass("jqTransformInputWrapper_error");
                            }
                            else
                                $(errorList[i].element).addClass("error_highlight");
                        }
                    });
                    if (gw_com_module.v_Option.message) {
                        var message = [
                            { text: "NOVALIDATE" }
                        ];
                        if (args.title != undefined)
                            message.unshift({ text: "◈ " + args.title + "<br><br>", align: "left", margin: 30 });
                        gw_com_api.messageBox(message);
                    }
                    else
                        gw_com_api.showMessage(msg);
                    errorList[0].element.focus();
                }
            }
        });

    },

    // validate. (form)
    formValidate: function (args) {

        var targetobj = "#" + args.targetid;
        return $(targetobj).valid();

    },

    // retrieve. (form)
    formRetrieve: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).block();
        if (args.source != undefined && args.source.block)
            $("#" + args.source.id).block();

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }
        /*
        var param = {
        targetid: args.targetid
        }
        this.formClear(param);
        */

        var url = (args.url != undefined)
            ? args.url : "../Service/svc_Retrieve_JSON.aspx";
        var params =
            "?QRY_ID=" +
            ((args.query != undefined) ? args.query : $(targetobj).attr("query")) +
            "&QRY_COLS=" +
            this.v_Object[args.targetid].column +
            "&CRUD=" +
            ((args.crud == "insert") ? "C"
                : (args.crud == "update") ? "U" : "R");
        if (args.source != undefined) {
            switch (args.source.type) {
                case "FORM":
                    {
                        var param = {
                            targetid: args.source.id
                        };
                        params = params + this.formtoARG(param);
                    }
                    break;
            }
            if (args.source.toggle)
                $("#" + args.source.id).toggle();
        }
        else if (args.params != undefined) {
            params = params + args.params;
        }

        var param = {
            request: "PAGE",
            url: url + params,
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            if (response.DATA.length > 0) {
                var param = {
                    targetid: args.targetid,
                    skip: args.skip,
                    fields: response.DATA,
                    edit: args.edit
                };
                gw_com_module.formAssign(param);
                if (args.updatable)
                    gw_com_api.setCRUD(args.targetid, 1, "modify");
            }
            else {
                var param = {
                    targetid: args.targetid
                }
                if (args.nodata == false) {
                    param.edit = true;
                    gw_com_module.formInsert(param);
                }
                else if (args.creatable != undefined) {
                    param.edit = true;
                    param.data = args.creatable.data;
                    gw_com_module.formInsert(param);
                }
                else {
                    gw_com_module.formClear(param);
                    if (args.clear != true)
                        gw_com_api.setDataStatus(args.targetid, 1, "retrieve");
                }
            }

            if (args.handler_success != undefined)
                args.handler_success(response.tData);
            else if (args.handler != undefined
                && args.handler.success != undefined)
                args.handler.success(response, args.handler.param);

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();

        };

        function completeRequest() {

            $(targetobj).unblock();
            if (args.source != undefined && args.source.block)
                $("#" + args.source.id).unblock();

            gw_com_module.v_Object[args.targetid].buffer.insert = null;
            gw_com_module.v_Object[args.targetid].buffer.insert = [];
            gw_com_module.v_Object[args.targetid].buffer.remove = null;
            gw_com_module.v_Object[args.targetid].buffer.remove = [];

            if (args.handler_complete != undefined)
                args.handler_complete();

        };

    },

    // retrieve. (html)
    htmlRetrieve: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).block();
        if (args.source != undefined && args.source.block)
            $("#" + args.source.id).block();

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }
        var param = {
            targetid: args.targetid
        }
        gw_com_module.htmlClear(param);

        var url = (args.url != undefined)
            ? args.url : "../Service/svc_Retrieve_JSON.aspx";
        var params =
            "?QRY_ID=" +
            ((args.query != undefined) ? args.query : $(targetobj).attr("query")) +
            "&QRY_COLS=" +
            this.v_Object[args.targetid].column +
            "&CRUD=R";
        if (args.source != undefined) {
            switch (args.source.type) {
                case "FORM":
                    {
                        var param = {
                            targetid: args.source.id
                        };
                        params = params + this.formtoARG(param);
                    }
                    break;
            }
            if (args.source.toggle)
                $("#" + args.source.id).toggle();
        }
        else if (args.params != undefined) {
            params = params + args.params;
        }

        var param = {
            request: "PAGE",
            url: url + params,
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            if (response.DATA.length > 0) {
                var param = {
                    targetid: args.targetid,
                    fields: response.DATA
                };
                gw_com_module.htmlAssign(param);
            }
            else {
                var param = {
                    targetid: args.targetid
                }
                gw_com_module.htmlClear(param);
            }

            if (gw_com_module.v_Current.loaded)
                gw_com_module.informSize();

            if (args.handler_success != undefined)
                args.handler_success(response.tData);
            else if (args.handler != undefined
                && args.handler.success != undefined)
                args.handler.success(response, args.handler.param);

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();

        };

        function completeRequest() {

            $(targetobj).unblock();
            if (args.source != undefined && args.source.block)
                $("#" + args.source.id).unblock();

            if (args.handler_complete != undefined)
                args.handler_complete();

        };

    },

    // assign. (form)
    formAssign: function (args) {

        var skip = ":submit, :reset, :image, [disabled], [readonly]";
        if (args.skip != undefined)
            skip = skip + args.skip;
        var targetobj = "#" + args.targetid;
        var elements = $(targetobj + " :input").not(skip).add(targetobj + " [noeditable]");
        for (ii = 0, cnt = 0; ii < elements.length; ii++, cnt++) {
            // for Edge by JJJ at 2021.04.06
            if (elements[ii].type == undefined || elements[ii].type == null)
                elements[ii].type = $("#" + elements[ii].id).attr("type");

            switch (elements[ii].type) {
                case "checkbox":
                    {
                        $(elements[ii]).attr("checked",
                            ($(elements[ii]).attr("onval") == args.fields[cnt]) ? true : false);
                        if ($(elements[ii]).attr("noeditable") == true) continue;
                        var elview = "#" + elements[ii].id + "_view";
                        $(elview).attr("checked",
                            ($(elements[ii]).attr("onval") == args.fields[cnt]) ? true : false);
                    }
                    break;
                case "radio":
                    {
                        var radio = $(targetobj + " :radio[name='" + elements[ii].name + "']");
                        var el = "#" + args.targetid + "_" + elements[ii].name;
                        var elview = "#" + args.targetid + "_" + elements[ii].name + "_view";
                        $.each(radio, function (jj) {
                            if ($(this).attr("value") == args.fields[cnt]) {
                                $(this).attr("checked", true);
                                $(el).val(args.fields[cnt]);
                                $(elview).val($(this).attr("text"));
                            }
                        });
                        ii = ii + radio.length - 1;
                    }
                    break;
                case "select":
                case "select-one":
                    {
                        var el = "#" + elements[ii].id;
                        var key = $(elements[ii]).data("key");
                        if (key != undefined) {
                            var filter = [];
                            $.each(key, function (i) {
                                filter.push($(targetobj + "_" + this).val());
                            });
                            var param = {
                                name: $(elements[ii]).data("memory"),
                                key: filter
                            };
                            data = gw_com_module.selectGet(param);
                            $(el + " option").remove();
                            $.each(data, function (j) {
                                if ($.browser.msie)
                                    $(el)[0].add(new Option(this.title, this.value));
                                else
                                    $(el)[0].add(new Option(this.title, this.value), null);
                            });
                        }
                        $(el).attr("selectedIndex", -1);
                        $(el).val(args.fields[cnt]);
                        $(el + "_view").val(args.fields[cnt]);
                        if ($(elements[ii]).attr("noeditable") == true) continue;
                        $(el + "_view").val($(el + " :selected").text());
                    }
                    break;
                case "textarea":
                    {
                        $(elements[ii]).val(args.fields[cnt]);
                        if ($(elements[ii]).attr("noeditable") == true) continue;
                        $("#" + elements[ii].id + "_view").val(args.fields[cnt]);
                        //$("#" + elements[ii].id + "_view").autoGrow();
                    }
                    break;
                case "html":
                    {
                        $(elements[ii]).html(args.fields[cnt]);
                    }
                    break;
                case "hidden":
                    {
                        var control =
                            gw_com_module.v_Control[$(elements[ii]).attr("control")];
                        if (control != undefined) {
                            switch (control.by) {
                                case "DX":
                                    {
                                        switch (control.type) {
                                            case "htmleditor":
                                                {
                                                    control.id.SetHtml(args.fields[cnt]);
                                                }
                                                break;
                                        }
                                    }
                                    break;
                            }
                        }
                        $(elements[ii]).val(args.fields[cnt]);
                    }
                    break;
                default:
                    {
                        var mask = $(elements[ii]).attr("mask");
                        var value = (mask != undefined)
                            ? gw_com_api.Mask(args.fields[cnt], mask) : args.fields[cnt];
                        $(elements[ii]).val(value);
                        if ($(elements[ii]).attr("noeditable") == true) continue;
                        if (value != "") {
                            var wrap = $("#" + elements[ii].id + "_view").attr("wrap");
                            switch (wrap) {
                                case "()":
                                    value = "(" + value + ")";
                                    break;
                                case "[]":
                                    value = "[" + value + "]";
                                    break;
                            }
                        }
                        $("#" + elements[ii].id + "_view").val(value);
                    }
                    break;
            }
            if ($(elements[ii]).hasClass(args.targetid + "_editchangable")) {
                ((elements[ii].type == "radio")
                    ? $(targetobj + "_" + elements[ii].name + "_data")
                    : $("#" + elements[ii].id + "_data"))
                    .val("");
            }
        };

        var param = {
            targetid: args.targetid,
            edit: args.edit
        };
        gw_com_module.formEdit(param);

    },

    // assign. (html)
    htmlAssign: function (args) {

        var targetobj = "#" + args.targetid;
        var elements = $(targetobj).find("div[container=true]");
        $.each(elements, function (ii) {
            $(this).html(args.fields[ii]);
        });

    },

    // edit. (form)
    formEdit: function (args) {

        var targetobj = "#" + args.targetid;

        if (args.clear) {
            $(targetobj + " div[editable=true] div." + args.targetid + "_edit").hide();
            $(targetobj + " div[editable] div." + args.targetid + "_format").show();
            $(targetobj).attr("process", "none");
        }
        else if (args.edit) {
            if ($(targetobj).attr("process") == "none"
                || $(targetobj).attr("process") == "format") {
                $(targetobj + " div[editable=true] div." + args.targetid + "_format").hide();
                $(targetobj + " div[editable=true] div." + args.targetid + "_edit").show();
                $(targetobj).attr("process", "edit");
            }
            if ($(targetobj).attr("focus") != undefined) {
                var el = targetobj + "_" + $(targetobj).attr("focus");
                ($(el).attr("type") == "text" || $(el).attr("type") == "textarea")
                    ? $(el).select() : $(el).focus();
            }
        }
        else if (args.edit != true
            && ($(targetobj).attr("process") == "none"
                || $(targetobj).attr("process") == "edit")) {
            $(targetobj + " div[editable=true] div." + args.targetid + "_edit").hide();
            $(targetobj + " div[editable] div." + args.targetid + "_format").show();
            $(targetobj).attr("process", "format");
        }

        if (this.v_Current.loaded)
            this.informSize();

    },

    // insert. (form)
    formInsert: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).block();

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }

        var skip = ":submit, :reset, :image, [disabled], [readonly]";
        if (args.skip != undefined)
            skip = skip + args.skip;
        var elements = $(targetobj + " :input").not(skip).add(targetobj + " [noeditable]");
        for (ii = 0; ii < elements.length; ii++) {
            switch (elements[ii].type) {
                case "checkbox":
                    {
                        $(elements[ii]).attr("checked", false);
                        $("#" + elements[ii].id + "_view").attr("checked", false);
                        var value = $(elements[ii]).attr("offval");
                        $(elements[ii]).val(value);
                        $("#" + elements[ii].id + "_view").val(value);
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val(value);
                    }
                    break;
                case "radio":
                    {
                        $("#" + args.targetid + "_" + elements[ii].name).val("");
                        var radio = $(targetobj + " :radio[name='" + elements[ii].name + "']");
                        $.each(radio, function (jj) {
                            $(this).attr("checked", false);
                        });
                        $("#" + args.targetid + "_" + elements[ii].name + "_view").val("");
                        ii = ii + radio.length - 1;
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $(targetobj + "_" + elements[ii].name).val("");
                    }
                    break;
                case "select":
                case "select-one":
                    {
                        $(elements[ii]).val("");
                        $(elements[ii]).attr("selectedIndex", -1);
                        $("#" + elements[ii].id + "_view").val("");
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val("");
                    }
                    break;
                case "textarea":
                    {
                        $(elements[ii]).val("");
                        $("#" + elements[ii].id + "_view").val("");
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val("");
                    }
                    break;
                case "html":
                    {
                        $(elements[ii]).html("");
                    }
                    break;
                case "hidden":
                    {
                        if (elements[ii].name == '_CRUD') {
                            $(elements[ii]).val((args.updatable) ? "C" : ((args.revise) ? "U" : "I"));
                        }
                        else {
                            var control =
                                gw_com_module.v_Control[$(elements[ii]).attr("control")];
                            if (control != undefined) {
                                switch (control.by) {
                                    case "DX":
                                        {
                                            switch (control.type) {
                                                case "htmleditor":
                                                    {
                                                        control.id.SetHtml("");
                                                    }
                                                    break;
                                            }
                                        }
                                        break;
                                }
                            }
                            $(elements[ii]).val("");
                        }
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val("");
                    }
                    break;
                default:
                    {
                        $(elements[ii]).val("");
                        $("#" + elements[ii].id + "_view").val("");
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val("");
                    }
                    break;
            }
        };
        gw_com_module.v_Object[args.targetid].buffer.insert = null;
        gw_com_module.v_Object[args.targetid].buffer.insert = [];
        gw_com_module.v_Object[args.targetid].buffer.remove = null;
        gw_com_module.v_Object[args.targetid].buffer.remove = [];

        gw_com_module.formEdit({ targetid: args.targetid });

        if (args.data != undefined) {
            $.each(args.data, function () {
                gw_com_api.setValue(args.targetid, 1, this.name, this.value, false, this.hide, this.change);
            });
        }

        var param = {
            targetid: args.targetid,
            edit: true
        };
        gw_com_module.formEdit(param);

        $(targetobj).unblock();

    },

    // delete. (form)
    formDelete: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj + ":input[name='_CRUD']").val("D");

    },

    // clear. (form)
    formClear: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).block();

        var skip = ":submit, :reset, :image, [disabled], [readonly]";
        if (args.skip != undefined)
            skip = skip + args.skip;
        var elements = $(targetobj + " :input").not(skip).add(targetobj + " [noeditable]");
        for (ii = 0; ii < elements.length; ii++) {
            switch (elements[ii].type) {
                case "checkbox":
                    {
                        $(elements[ii]).attr("checked", false);
                        $("#" + elements[ii].id + "_view").attr("checked", false);
                        var value = $(elements[ii]).attr("offval");
                        $(elements[ii]).val(value);
                        $("#" + elements[ii].id + "_view").val(value);
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val(value);
                    }
                    break;
                case "radio":
                    {
                        $("#" + args.targetid + "_" + elements[ii].name).val("");
                        var radio = $(targetobj + " :radio[name='" + elements[ii].name + "']");
                        $.each(radio, function (jj) {
                            $(this).attr("checked", false);
                        });
                        $("#" + args.targetid + "_" + elements[ii].name + "_view").val("");
                        ii = ii + radio.length - 1;
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $(targetobj + "_" + elements[ii].name).val("");
                    }
                    break;
                case "select":
                case "select-one":
                    {
                        $(elements[ii]).val("");
                        $(elements[ii]).attr("selectedIndex", -1);
                        $("#" + elements[ii].id + "_view").val("");
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val("");
                    }
                    break;
                case "textarea":
                    {
                        $(elements[ii]).val("");
                        $("#" + elements[ii].id + "_view").val("");
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val("");
                    }
                    break;
                case "html":
                    {
                        $(elements[ii]).html("");
                    }
                    break;
                case "hidden":
                    {
                        var control =
                            gw_com_module.v_Control[$(elements[ii]).attr("control")];
                        if (control != undefined) {
                            switch (control.by) {
                                case "DX":
                                    {
                                        switch (control.type) {
                                            case "htmleditor":
                                                {
                                                    control.id.SetHtml("");
                                                }
                                                break;
                                        }
                                    }
                                    break;
                            }
                        }
                        $(elements[ii]).val("");
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val("");
                    }
                    break;
                default:
                    {
                        $(elements[ii]).val("");
                        $("#" + elements[ii].id + "_view").val("");
                        if ($(elements[ii]).hasClass(args.targetid + "_editchangable"))
                            $("#" + elements[ii].id + "_data").val("");
                    }
                    break;
            }
        };
        if (gw_com_module.v_Object[args.targetid]) gw_com_module.v_Object[args.targetid].buffer.insert = null;
        if (gw_com_module.v_Object[args.targetid]) gw_com_module.v_Object[args.targetid].buffer.insert = [];
        if (gw_com_module.v_Object[args.targetid]) gw_com_module.v_Object[args.targetid].buffer.remove = null;
        if (gw_com_module.v_Object[args.targetid]) gw_com_module.v_Object[args.targetid].buffer.remove = [];

        var param = {
            targetid: args.targetid,
            clear: true
        };
        gw_com_module.formEdit(param);

        $(targetobj).unblock();

    },

    // clear. (html)
    htmlClear: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).block();

        var elements = $(targetobj).find("div[container=true]");
        $.each(elements, function () {
            $(this).html("");
        });

        $(targetobj).unblock();

    },

    // create. (grid)
    gridCreate: function (args) {

        var targetobj = "#" + args.targetid;
        if (gw_com_module.v_Option.authority.usable) {
            if (gw_com_module.v_Option.authority.control == "R" && args.editable != undefined)
                args.editable = undefined;
        }
        var content = "";
        /*
        if (args.width) {
        $(targetobj).wrap(
        "<div style='width:" + args.width + "px;'>");
        }
        */
        $(targetobj).wrap(
            "<div style='width:100%;'>");
        content = content +
            "<div id='" + args.targetid + "_obj'" + /* class='gridwrapper'*/" style='width:100% margin:0; padding:0;'>";
        //if (args.editable != undefined) {
        content = content +
            "<form" +
            " id='" + args.targetid + "_form'" +
            " action = ''>";
        //}
        content = content +
            "<table" +
            " id='" + args.targetid + "_data'" +
            " name='" + args.targetid + "_data'" +
            ((args.query != undefined) ? "query='" + args.query + "'" : "") +
            ">" +
            "</table>";
        //if (args.editable != undefined) {
        content = content +
            "</form>";
        //}
        if (args.pager != false) {
            content = content +
                "<div" +
                " id='" + args.targetid + "_pager'>" +
                "</div>";
        }

        // Set Languages : by JJJ at 2020.01
        gw_com_langs.setLangs("gridCreate", args);

        content = content +
            "</div>";
        $(targetobj).attr("title", args.title);
        $(targetobj).html(content);
        if (args.editable != undefined) {
            if (args.editable.validate == true) {
                $($(targetobj + "_form")).validate({
                    meta: "validate",
                    onkeyup: false,
                    onclick: false,
                    focusInvalid: false,
                    focusCleanup: false,
                    onfocusout: false,
                    ignoreTitle: true,
                    unhighlight: function (element, errorClass) {
                        $(element).removeClass("error_highlight");
                    },
                    showErrors: function (errorMap, errorList) {
                        if (errorList.length > 0) {
                            var msg = "* 입력 오류 *\n\n";
                            $.each(errorList, function (i) {
                                msg = msg + errorList[i].element.title + " - " + errorList[i].message + "\n";
                                $(errorList[i].element).addClass("error_highlight");
                            });
                            errorList[0].element.focus();
                            if (gw_com_module.v_Option.message) {
                                var message = [
                                    { text: "NOVALIDATE" }
                                ];
                                if (args.title != undefined)
                                    message.unshift({ text: "◈ " + args.title + "<br><br>", align: "left", margin: 30 });
                                gw_com_api.messageBox(message);
                            }
                            else
                                gw_com_api.showMessage(msg);
                        }
                    }
                });
            }
            $.data($(targetobj + "_data")[0], "editable", {
                master: (args.editable.master) ? true : false,
                multi: (args.editable.multi) ? true : false,
                bind: (args.editable.bind != undefined) ? args.editable.bind : false,
                focus: (args.editable.focus != undefined) ? args.editable.focus : false
            });
        }
        if (args.selectable) {
            var wrapperobj = "#" + args.targetid + "_obj";
            //$(wrapperobj).addClass("gridwrapper");
            $(wrapperobj).addClass("selectedlayer");
            /*
            $(wrapperobj).click(function(i) {
            if (gw_com_module.v_Current.object != null
            && gw_com_module.v_Current.object != args.targetid)
            $("#" + gw_com_module.v_Current.object + "_obj").css("border-color", "#ffffff");
            //$("#" + gw_com_module.v_Current.object + "_obj").removeClass("selectedlayer");
            gw_com_module.v_Current.object = args.targetid;
            //$(wrapperobj).addClass("selectedlayer");
            $("#" + gw_com_module.v_Current.object + "_obj").css("border-color", "#b1b1cc");
            });
            */
        }

        var header = "";
        var column = "";
        var view = "";
        var option = {};
        var datepicker = [];
        var colname = [];
        var colmodel = [];
        $.each(args.element, function (i) {
            column = column +
                ((i > 0) ? "," : "") + encodeURIComponent(this.name);
            if (this.excel || this.hidden != true) {
                header = header +
                    ((i > 0) ? "," : "") + encodeURIComponent((this.lead != undefined) ? this.lead : this.header);
                view = view +
                    ((i > 0) ? "," : "") + encodeURIComponent((this.view != undefined) ? this.view : this.name);
            }
            option[this.name] = {};
            var format = (this.format != undefined) ? this.format.type : "text";
            if (args.editable == undefined) this.editable = undefined;	// added by JJJ at 2012.09.20
            var edit = (this.editable != undefined) ? this.editable.type : false;
            option[this.name].format = format;
            option[this.name].edit = edit;
            option[this.name].mask = (this.mask != undefined) ? this.mask : "";
            if (this.display) option[this.name].display = true;
            colname.push(this.header);
            var model = {
                name: this.name,
                index: this.name
            };
            if (this.hidden)
                model.hidden = true;
            if (this.width != undefined)
                model.width = this.width;
            if (this.align != undefined)
                model.align = this.align;
            if (this.multiline)
                model.multiline = true;
            switch (format) {
                case "checkbox":
                    {
                        model.formatoptions = {
                            title: this.format.title,
                            value: this.format.value
                        };
                        model.formatter = formatCheck;
                    }
                    break;
                case "radio":
                    {
                        model.formatoptions = { child: this.format.child };
                        model.formatter = formatRadio;
                    }
                    break;
                case "select":
                    {
                        model.formatoptions = {
                            data: this.format.data
                        };
                        model.formatter = formatSelect;
                    }
                    break;
                case "label":
                    {
                        model.formatter = formatLabel;
                    }
                    break;
                case "text":
                    {
                        if (this.mask != undefined) {
                            model.formatoptions = {
                                mask: this.mask
                            };
                            model.formatter = formatMask;
                            model.unformatter = unformatMask;
                        }
                        else if (this.fix != undefined) {
                            model.formatoptions = {
                                fix: this.fix
                            };
                            model.formatter = formatFix;
                            //model.unformatter = unformatMask;
                        }
                    }
                    break;
                case "link":
                    {
                        model.formatoptions = {
                            parent: args.targetid,
                            value: this.format.value,
                            exceptionvalues: this.format.exceptionvalues
                        };
                        model.formatter = formatLink;
                    }
                    break;

            }
            if (edit != false) {
                model.editable = true;
                model.edittype = "custom";
                model.edittag = edit;
                switch (edit) {
                    case "text":
                        {
                            model.editoptions = {
                                parent: args.targetid,
                                bind: this.editable.bind,
                                width: (this.editable.width != undefined) ? this.editable.width : this.width,
                                custom_element: entryText,
                                custom_value: valueDefault,
                                placeholder: (this.editable.placeholder == undefined ? "" : this.editable.placeholder)
                            };
                            if (this.editable.maxlength != undefined)
                                model.editoptions.maxlength = this.editable.maxlength;
                        }
                        break;
                    case "textarea":
                        {
                            model.editoptions = {
                                parent: args.targetid,
                                bind: this.editable.bind,
                                width: (this.editable.width != undefined) ? this.editable.width : this.width,
                                custom_element: entryArea,
                                custom_value: valueDefault,
                                placeholder: (this.editable.placeholder == undefined ? "" : this.editable.placeholder)
                            };
                            if (this.editable.rows != undefined)
                                model.editoptions.rows = this.editable.rows;
                        }
                        break;
                    case "checkbox":
                        {
                            model.editoptions = {
                                custom_element: entryCheck,
                                custom_value: valueCheck
                            };
                            if (this.editable.title != undefined)
                                model.editoptions.text = this.editable.title;
                            model.editoptions.value = this.editable.value;
                            model.editoptions.offval = this.editable.offval;
                        }
                        break;
                    case "radio":
                        {
                            model.editoptions = {
                                custom_element: entryRadio,
                                custom_value: valueRadio
                            };
                            model.editoptions.child = this.editable.child;
                        }
                        break;
                    case "select":
                        {
                            model.editoptions = {
                                parent: args.targetid,
                                bind: this.editable.bind,
                                width: (this.editable.width != undefined) ? this.editable.width : this.width,
                                custom_element: entrySelect,
                                custom_value: valueDefault
                            };
                            model.editoptions.size =
                                (this.editable.size != undefined) ? this.editable.size : 1;
                            if (this.editable.data != undefined) {
                                model.editoptions.data = this.editable.data;
                            }
                            if (this.editable.change != undefined) {
                                model.editoptions.change = this.editable.change;
                            }
                        }
                        break;
                    case "save":
                    case "hidden":
                        {
                            model.editoptions = {
                                custom_element: entryHidden,
                                custom_value: valueHidden
                            };
                        }
                        break;
                }
                if (this.mask != undefined) {
                    if (edit == "text" && this.mask == "date-ymd") {
                        model.editoptions.width = model.editoptions.width - 18;
                        datepicker.push(model.name);
                    }
                    model.editoptions.mask = this.mask;
                }
                if (this.display)
                    model.editoptions.display = this.display;
                var estyle = "";
                if (args.editable) {
                    estyle = args.targetid + "_editchangable";
                }
                if (this.editable.validate != undefined) {
                    model.editoptions.title = this.editable.validate.message;
                    estyle = estyle +
                        " {validate: { " + this.editable.validate.rule + " }}";
                }
                if (estyle != "")
                    model.editoptions.style = estyle;
                model.editoptions.readonly = this.editable.readonly;
                model.editoptions.disable = this.editable.disable;
            }
            if (this.summary != undefined) {
                option[this.name].summary = this.summary;
                model.summaryType =
                    (this.summary.type == undefined) ? "count" : this.summary.type;
                var summary = "{0}";
                if (this.summary.title != undefined)
                    summary = "<span style='font-weight:normal;'>" + this.summary.title + "</span>";
                //summary = this.summary.title;
                if (this.summary.prefix != undefined)
                    summary = this.summary.prefix + summary;
                if (this.summary.suffix != undefined)
                    summary = summary + this.summary.suffix;
                model.summaryTpl = "<span style='font-weight:bold;'>" + summary + "</span>";
            }
            if (this.style != undefined) {
                var attr = this.style;
                model.cellattr = function (rowId, tv, rawObject, cm, rdata) {
                    if (attr.bgcolor != undefined)
                        return "style=' background-color:" + attr.bgcolor + "'";
                };
            }
            if (this.sorttype != undefined)
                model.sorttype = this.sorttype;
            else if (this.mask != undefined) {
                if ($.inArray(this.mask.substring(0, 4), ["curr", "nume"]) >= 0)
                    model.sorttype = "number";
            }
            colmodel.push(model);
        });
        colname.unshift("No.");
        colmodel.unshift({
            name: '_NO',
            index: '_NO',
            sorttype: 'int',
            width: 30,
            align: 'center',
            hidden: (args.number) ? false : true
        });
        option["_NO"] = {
            format: "text",
            edit: false,
            mask: ""
        }
        colname.push("_CRUD");
        colmodel.push({
            name: '_CRUD',
            index: '_CRUD',
            hidden: true,
            editable: true,
            edittype: 'text'
        });
        option["_CRUD"] = {
            format: "text",
            edit: "text",
            mask: ""
        }
        var obj = {
            header: header,
            column: column,
            view: view,
            option: option,
            datepicker: datepicker,
            buffer: {
                insert: [],
                remove: []
            },
            current: null
        };
        gw_com_module.v_Object[args.targetid] = obj;

        var option = {
            //url: url,
            //datatype: 'xml',
            datatype: '',
            //autoencode: true,
            mtype: 'GET',
            colNames: colname,
            colModel: colmodel,
            rowNum: (args.dynamic) ? 50 : 1000000,
            rowTotal: 1000000,
            caption: (args.caption) ? "◈ " + args.title : "",
            width: (args.width != undefined) ? args.width : "100%",
            height: args.height,
            multiselect: (args.multi) ? true : false,
            shrinkToFit: false,
            loadonce: true,
            hiddengrid: (args.hiddengrid) ? true : false,
            gridview: ((args.editable != undefined && args.editable.bind == "get")
                || args.color != undefined || args.strike != undefined || args.subgrid != undefined)
                ? false : true,
            scroll: (args.dynamic) ? true : 0,
            loadui: false,
            footerrow: (args.footer) ? true : false,
            userDataOnFooter: (args.footer) ? true : false,
            //loadtext: "처리 중입니다...",
            scrollrows: true,
            afterInsertRow: function (rowid, rowdata, rowelem) {
                if (args.color != undefined) {
                    if (args.color.rule != undefined) {
                        $.each(args.color.rule, function () {
                            var style = (this.color != undefined) ? "color" : "background-color";
                            var color = (this.color != undefined) ? this.color : this.bgcolor;
                            $.each(this.element, function () {
                                if (style == "color")
                                    $(targetobj + "_data").jqGrid('setCell', rowid, this, '', { "color": color });
                                else
                                    $(targetobj + "_data").jqGrid('setCell', rowid, this, '', { "background-color": color });
                            });
                        });
                    }
                    else {
                        if (rowdata.color != undefined) {
                            if (args.color.row) {
                                $.each(rowdata, function (col_i) {
                                    $(targetobj + "_data").jqGrid('setCell', rowid, col_i, '', { 'color': rowdata.color });
                                });
                            }
                            else {
                                $.each(args.color.element, function () {
                                    $(targetobj + "_data").jqGrid('setCell', rowid, this, '', { 'color': rowdata.color });
                                });
                            }
                        }
                        if (rowdata.bgcolor != undefined) {
                            if (args.color.row) {
                                $.each(rowdata, function (col_i) {
                                    $(targetobj + "_data").jqGrid('setCell', rowid, col_i, '', { 'background-color': rowdata.bgcolor });
                                });
                            }
                            else {
                                $.each(args.color.element, function () {
                                    $(targetobj + "_data").jqGrid('setCell', rowid, this, '', { 'background-color': rowdata.bgcolor });
                                });
                            }
                        }
                    }
                }
                if (args.strike != undefined) {
                    if (args.strike.rule != undefined) {
                    }
                    else {
                        if (rowdata.strike == "1") {
                            $.each(args.strike.element, function () {
                                //var value = $(targetobj + "_data").jqGrid('getCell', rowid, this);
                                var value = rowdata[this];
                                $(targetobj + "_data").jqGrid('setCell', rowid, this, "<strike>" + value + "</strike>");
                            });
                        }
                    }
                }
                if (args.editable != undefined && args.editable.bind == "get") {
                    if (args.editable.by == undefined || rowdata[args.editable.by] == "1") {
                        gw_com_module.gridEdit({
                            targetid: args.targetid,
                            row: rowid,
                            edit: true
                        });
                    }
                }
            },
            beforeSelectRow: function (row, e) {
                if (args.multi != true) {
                    var param = {
                        name: "beforeSelectRow",
                        targetid: args.targetid,
                        row: row,
                        e: e
                    };
                    if (!gw_com_module.gridEvent(param))
                        return false;
                }
                var param = {
                    type: "GRID",
                    object: args.targetid,
                    row: row
                }
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.rowselecting != undefined)
                    return event.rowselecting(param);
                return true;
            },
            onSelectRow: function (row, status) {
                if (args.multi != true) {
                    var param = {
                        name: "onSelectRow",
                        targetid: args.targetid,
                        row: row,
                        status: status
                    };
                    gw_com_module.gridEvent(param);
                }
                var param = {
                    type: "GRID",
                    object: args.targetid,
                    row: row,
                    status: status
                }
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.rowselected != undefined)
                    return event.rowselected(param);
            },
            ondblClickRow: function (rowid, iRow, iCol, e) {
                var param = {
                    type: "GRID",
                    object: args.targetid,
                    row: rowid,
                    element: gw_com_api.getColName(args.targetid, iCol)
                }
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.rowdblclick != undefined)
                    return event.rowdblclick(param);
            },
            /*
            onCellSelect: function(row, col, content, e) {

            if (args.editable != undefined) {
            var param = {
            name: "onCellSelect",
            targetid: args.targetid,
            row: row,
            col: col,
            content: content
            };
            gw_com_module.gridEvent(param);
            }
            var param = {
            type: "GRID",
            object: args.targetid,
            row: row,
            col: col,
            content: content
            }
            var event = $.data($(targetobj + "_data")[0], "event");
            if (event.cellselected != undefined)
            event.cellselected(param);

            },
            */
            gridComplete: function () {
                completeProcess();
            },
            loadComplete: function (response) {
                successRequest(response);
            },
            loadError: function (xmlRequest, status, error) {
                alert(
                    xmlRequest.status + '\r\n' + xmlRequest.statusText + '\r\n' + xmlRequest.responseText);
                errorRequest();
            }
        };
        if (args.pager != false) {
            option.pager = targetobj + "_pager";
            if (typeof (args.pager) == "object") {
                option.viewrecords = (args.pager.viewrecords == true);
                option.pgbuttons = (args.pager.pgbuttons == true);
                option.pginput = (args.pager.pginput == true);
                //option.pgtext = (args.pager.pgtext == undefined ? "/" : args.pager.pgtext);
                option.rowNum = (args.pager.rownum == undefined ? 20 : args.pager.rownum);
            } else {
                option.viewrecords = true;
                option.pgbuttons = false;
                option.pginput = false;
                option.pgtext = false;
            }
        }
        if (args.treegrid != undefined) {
            option.treeGrid = true;
            //option.treeGridModel = "nested";
            option.treeGridModel = "adjacency";
            option.treedatatype = "xml";
            option.treeIcons = { leaf: "ui-icon-document-b" };
            option.ExpandColumn = args.treegrid.element;
        }
        if (args.subgrid != undefined) {
            option.subGrid = true;
            option.subGridRowExpanded = function (sub_id, row_id) {

                var sub_data, sub_pager;
                sub_data = sub_id + "_t";
                sub_pager = "p_" + sub_data;
                $("#" + sub_id)
                    .html("<table id='" + sub_data + "' class='scroll'></table><div id='" + sub_pager + "' class='scroll'></div>");
                var sub_column = "";
                var sub_colname = [];
                var sub_colmodel = [];
                $.each(args.subgrid.element, function (sub_i) {
                    sub_column = sub_column +
                        ((sub_i > 0) ? "," : "") + encodeURIComponent(this.name);
                    var sub_format = (this.format != undefined) ? this.format.type : "text";
                    sub_colname.push(this.header);
                    var sub_model = {
                        name: this.name,
                        index: this.name
                    };
                    switch (sub_format) {
                        case "checkbox":
                            {
                                sub_model.formatoptions = {
                                    title: this.format.title,
                                    value: this.format.value
                                };
                                sub_model.formatter = formatCheck;
                            }
                            break;
                        case "radio": {
                            model.formatoptions = {
                                child: this.format.child
                            };
                            model.formatter = formatRadio;
                        } break;
                        case "select":
                            {
                                sub_model.formatoptions = {
                                    data: this.format.data
                                };
                                sub_model.formatter = formatSelect;
                            }
                            break;
                        case "text":
                            {
                                if (this.mask != undefined) {
                                    sub_model.formatoptions = {
                                        mask: this.mask
                                    };
                                    sub_model.formatter = formatMask;
                                    sub_model.unformatter = unformatMask;
                                }
                                else if (this.fix != undefined) {
                                    sub_model.formatoptions = {
                                        fix: this.fix
                                    };
                                    sub_model.formatter = formatFix;
                                    //model.unformatter = unformatMask;
                                }
                            }
                            break;
                    }
                    if (this.hidden)
                        sub_model.hidden = true;
                    if (this.width != undefined)
                        sub_model.width = this.width;
                    if (this.align != undefined)
                        sub_model.align = this.align;
                    if (this.style != undefined) {
                        var attr = this.style;
                        sub_model.cellattr = function (rowId, tv, rawObject, cm, rdata) {
                            if (attr.bgcolor != undefined)
                                return "style=' background-color:" + attr.bgcolor + "'";
                        };
                    }
                    sub_colmodel.push(sub_model);
                });
                sub_colname.unshift("No.");
                sub_colmodel.unshift({
                    name: '_NO',
                    index: '_NO',
                    sorttype: 'int',
                    width: 30,
                    align: 'center',
                    hidden: (args.subgrid.number) ? false : true
                });
                sub_colname.push("_CRUD");
                sub_colmodel.push({
                    name: '_CRUD',
                    index: '_CRUD',
                    hidden: true,
                    editable: true,
                    edittype: 'text'
                });

                var sub_url = (args.subgrid.url != undefined)
                    ? args.subgrid.url : "../Service/svc_Retrieve_XML.aspx";
                var sub_params =
                    "?QRY_ID=" + args.subgrid.query +
                    "&QRY_COLS=" + sub_column +
                    "&CRUD=R" +
                    "&OPTION=NONE";
                $.each(args.subgrid.argument, function (sub_i) {
                    var sub_value =
                        gw_com_api.getValue(args.targetid, row_id, this.name, true);
                    sub_params = sub_params + "&" +
                        encodeURIComponent(this.argument) + "=" +
                        encodeURIComponent(sub_value);
                });
                var sub_option = {
                    //url: url,
                    //datatype: 'xml',
                    url: sub_url + sub_params,
                    datatype: 'xml',
                    mtype: 'GET',
                    colNames: sub_colname,
                    colModel: sub_colmodel,
                    rowNum: (args.subgrid.dynamic) ? 50 : 1000000,
                    rowTotal: 1000000,
                    caption: (args.subgrid.caption) ? "◈ " + args.subgrid.title : "",
                    width: (args.subgrid.width != undefined) ? args.subgrid.width : "100%",
                    height: args.subgrid.height,
                    //multiselect: (args.subgrid.multi) ? true : false,
                    shrinkToFit: false,
                    loadonce: true,
                    //gridview: true,
                    scroll: (args.subgrid.dynamic) ? true : 0,
                    //loadui: false,
                    loadtext: "처리 중입니다...",
                    afterInsertRow: function (rowid, rowdata, rowelem) {
                        if (args.subgrid.color != undefined) {
                            if (args.subgrid.color.rule != undefined) {
                                $.each(args.subgrid.color.rule, function () {
                                    var style = (this.color != undefined) ? "color" : "background-color";
                                    var color = (this.color != undefined) ? this.color : this.bgcolor;
                                    $.each(this.element, function () {
                                        if (style == "color")
                                            $("#" + sub_data).jqGrid('setCell', rowid, this, '', { "color": color });
                                        else
                                            $("#" + sub_data).jqGrid('setCell', rowid, this, '', { "background-color": color });
                                    });
                                });
                            }
                            else {
                                if (rowdata.color != undefined) {
                                    if (args.subgrid.color.row) {
                                        $.each(rowdata, function (col_i) {
                                            $("#" + sub_data).jqGrid('setCell', rowid, col_i, '', { 'color': rowdata.color });
                                        });
                                    }
                                    else {
                                        $.each(args.subgrid.color.element, function () {
                                            $("#" + sub_data).jqGrid('setCell', rowid, this, '', { 'color': rowdata.color });
                                        });
                                    }
                                }
                                else if (rowdata.bgcolor != undefined) {
                                    if (args.subgrid.color.row) {
                                        $.each(rowdata, function (col_i) {
                                            $("#" + sub_data).jqGrid('setCell', rowid, col_i, '', { 'background-color': rowdata.bgcolor });
                                        });
                                    }
                                    else {
                                        $.each(args.subgrid.color.element, function () {
                                            $("#" + sub_data).jqGrid('setCell', rowid, this, '', { 'background-color': rowdata.bgcolor });
                                        });
                                    }
                                }
                            }
                        }
                    }
                };
                $("#" + sub_data).jqGrid(sub_option);

            };
            option.subGridRowColapsed = function (sub_id, row_id) {
                var sub_data = sub_id + "_t";
                $("#" + sub_data).remove();
            };
        }
        if (args.group != undefined) {
            option.grouping = true;
            option.groupingView = {
                groupField: [],
                groupColumnShow: [],
                groupText: [],
                groupCollapse: [],
                groupOrder: [],
                groupSummary: []
            };
            $.each(args.group, function (i) {
                option.groupingView.groupField.push(this.element);
                option.groupingView.groupColumnShow.push((this.show) ? true : false);
                option.groupingView.groupText.push(
                    "<div style='margin-top:3px; font-weight:" + ((this.bold == false) ? "normal" : "bold") + ";'>{0}</div>");
                option.groupingView.groupCollapse.push(true);
                //option.groupingView.groupOrder.push((this.desc) ? "desc" : "asc");
                option.groupingView.groupSummary.push((this.summary) ? true : false);
            });
            option.groupingView.groupDataSorted = false;
            option.groupingView.showSummaryOnHide = true;
        }
        $(targetobj + "_data").jqGrid(option);
        if (args.nogroup)
            $(targetobj + "_data").jqGrid('groupingRemove', true);
        if (args.key != false) {
            $(targetobj + "_data").jqGrid('bindKeys', {
                "onEnter": function (rowid, a) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: rowid
                    }
                    var event = $.data($(targetobj + "_data")[0], "event");
                    if (event.rowkeyenter != undefined) {
                        event.rowkeyenter(param);
                        return false;
                    }
                    return true;
                },
                "updownKey": (args.key) ? true : false
            });
        }
        $.data($(targetobj + "_data")[0], "event", {});
        if (args.multi && args.checkrow != true)
            $(targetobj + "_data").hideCol('cb');
        if (args.show == false) {
            $(targetobj).hide();
        }
        if ($("#navContext").length > 0) {
            $("#" + args.targetid).contextMenu(
                { menu: 'navContext' },
                function (action, el, pos) {
                    gw_com_module.gridDownload({ targetid: args.targetid });
                }
            );
        }

        var $footRow = $(targetobj + "_data").closest(".ui-jqgrid-bdiv")
            .next(".ui-jqgrid-sdiv")
            .find(".footrow");
        $footRow.children("td").css("background-color", "#E1E6F6");

        function completeProcess() {

            if (args.processed)
                return;

            if (args.handler_processed != undefined)
                args.handler_processed();

        };

        function successRequest(response) {

            if (args.processed)
                return;

            if (args.show == false)
                $(targetobj).hide();
            else if (gw_com_module.v_Current.loaded)
                gw_com_module.informSize();

            if (args.handler_success != undefined)
                args.handler_success(response.tData);

            args.processed = true;

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();

        };

        function formatLabel(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            var el =
                "<div style='margin-top: 3px;'>" +
                cellvalue +
                "</div>";
            return el;

        };

        function formatMask(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            switch (options.colModel.formatoptions.mask) {
                case "date-ym":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 4) + "-";
                        format = format + cellvalue.substr(4, 2);
                        return format;
                    };
                case "date-ymd":
                    {
                        var value = cellvalue.split("-");
                        if (cellvalue == "" || value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 4) + "-";
                        format = format + cellvalue.substr(4, 2) + "-";
                        format = format + cellvalue.substr(6, 2);
                        return format;
                    };
                case "time-hh":
                    {
                        var format = (cellvalue != "") ? cellvalue + "시" : cellvalue;
                        return format;
                    };
                case "time-hm":
                    {
                        var value = cellvalue.split(":");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 2) + ":";
                        format = format + cellvalue.substr(2, 2);
                        return format;
                    };
                case "biz-no":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 3) + "-";
                        format = format + cellvalue.substr(3, 2) + "-";
                        format = format + cellvalue.substr(5, 5);
                        return format;
                    };
                case "person-id":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 6) + "-";
                        format = format + cellvalue.substr(6, 7);
                        return format;
                    };
                case "currency-ko":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'ko-KR' });
                        return $(el).val();
                    };
                case "numeric-int":
                case "currency-int":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'int' });
                        return $(el).val();
                    };
                case "numeric-float":
                case "currency-none":
                case "currency-float":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float' });
                        return $(el).val();
                    };
                case "numeric-float1":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float1' });
                        return $(el).val();
                    };
                case "numeric-float4":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float4' });
                        return $(el).val();
                    };
            }
            return cellvalue;

        };

        function unformatMask(cellvalue, options, cellObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            switch (options.colModel.formatoptions.mask) {
                case "date-ym":
                case "date-ymd":
                case "biz-no":
                case "person-id":
                    {
                        cellvalue = cellvalue.replace(/\_/g, "");
                        var value = cellvalue.split("-");
                        return value.join("");
                        //var format = "";
                        //$.each(value, function (i) {
                        //    format = format + this;
                        //});
                        //return format;
                    }
                case "time-hh":
                    {
                        var format = cellvalue.replace(/\_/g, "").replace("시", "");
                        return format;
                    }
                case "time-hm":
                    {
                        cellvalue = cellvalue.replace(/\_/g, "");
                        var value = cellvalue.split(":");
                        return value.join("");
                        //var format = "";
                        //$.each(value, function (i) {
                        //    format = format + this;
                        //});
                        //return format;
                    }
                case "numeric-int":
                case "currency-ko":
                case "currency-int":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        return $(el).asNumber({ parseType: 'Int' });
                    }
                    break;
                case "numeric-float":
                case "numeric-float1":
                case "numeric-float4":
                case "currency-none":
                case "currency-float":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        return $(el).asNumber({ parseType: 'float' });
                    }
                    break;
            }
            return cellvalue;

        };

        function formatFix(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            switch (options.colModel.formatoptions.fix.mask) {
                case "date-ym":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 4) + "-";
                        format = format + cellvalue.substr(4, 2);
                        cellvalue = format;
                    }
                    break;
                case "date-ymd":
                    {
                        var value = cellvalue.split("-");
                        if (cellvalue == "" || value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 4) + "-";
                        format = format + cellvalue.substr(4, 2) + "-";
                        format = format + cellvalue.substr(6, 2);
                        cellvalue = format;
                    }
                    break;
                case "time-hh":
                    {
                        var format = (cellvalue != "") ? cellvalue + "시" : cellvalue;
                        cellvalue = format;
                    };
                    break;
                case "time-hm":
                    {
                        var value = cellvalue.split(":");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 2) + ":";
                        format = format + cellvalue.substr(2, 2);
                        cellvalue = format;
                    }
                    break;
                case "biz-no":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 3) + "-";
                        format = format + cellvalue.substr(3, 2) + "-";
                        format = format + cellvalue.substr(5, 5);
                        cellvalue = format;
                    }
                    break;
                case "person-id":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 6) + "-";
                        format = format + cellvalue.substr(6, 7);
                        cellvalue = format;
                    }
                    break;
                case "currency-ko":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'ko-KR' });
                        cellvalue = $(el).val();
                    }
                    break;
                case "numeric-int":
                case "currency-int":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'int' });
                        cellvalue = $(el).val();
                    }
                    break;
                case "numeric-float":
                case "currency-none":
                case "currency-float":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float' });
                        cellvalue = $(el).val();
                    }
                    break;
                case "numeric-float1":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float1' });
                        cellvalue = $(el).val();
                    }
                    break;
                case "numeric-float4":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float4' });
                        cellvalue = $(el).val();
                    }
                    break;
            }
            if (options.colModel.formatoptions.fix.suffix != undefined)
                cellvalue = cellvalue + " " + options.colModel.formatoptions.fix.suffix;
            if (options.colModel.formatoptions.fix.margin != undefined) {
                for (var space = 0; space < options.colModel.formatoptions.fix.margin; space++)
                    cellvalue = cellvalue + " ";
            }
            if (options.colModel.formatoptions.fix.strike != undefined) {
                var strike = "0";
                if (rowObject.childNodes == undefined) {
                    strike = $("#" + options.gid).getCell(options.rowId, options.colModel.formatoptions.fix.strike);
                }
                else {
                    var match = 0;
                    for (var col_j = 0; col_j < colmodel.length; col_j++) {
                        if (colmodel[col_j].name == options.colModel.formatoptions.fix.strike) { match = col_j; break; }
                    }
                    strike = rowObject.childNodes[match].text;
                }
                if (strike == "1")
                    cellvalue = "<strike>" + cellvalue + "</strike>";
            }
            return cellvalue;

        };

        function formatCheck(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            if ($(cellvalue).length > 0) return cellvalue;
            var el =
                "<div" +
                //" style='display:none;'" +
                ">" +
                "<input" +
                " type='checkbox'" +
                " value='" + cellvalue + "'" +
                " disabled=true";
            if (options.colModel.formatoptions.value == cellvalue)
                el = el +
                    " checked=true";
            el = el +
                " style='margin:2px 3px 0px 0px; vertical-align:-2px;'" +
                " />";
            if (options.colModel.formatoptions.title != undefined)
                el = el +
                    "<span" +
                    " style='padding-left:2px;'>" +
                    options.colModel.formatoptions.title +
                    "</span>";
            el = el +
                "</div>";
            return el + "<input type='hidden' value='" + cellvalue + "' />";

        };

        function formatRadio(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            if ($(cellvalue).length > 0) return cellvalue;

            // Edited by JJJ at 2019.12.06
            var el = "<div" +
                //" style='display:none;'" +
                ">";
            $.each(options.colModel.formatoptions.child, function () {
                el = el +
                    "<input" +
                    " type='radio'" +
                    " name='" + "radio" + "_" + options.colModel.name + "_" + options.rowId + "'" +
                    " value='" + this.value + "'" +
                    ((this.value == cellvalue) ? " checked=true" : "") + " disabled=true" +
                    " style='" + ((args.trans) ? "" : "margin: 0px 3px 1px 0px; vertical-align: -2px;") + "'" +
                    " />" +
                    "<span style='margin-top:0px;'>" + this.title + "</span>";
            });
            el = el + "</div>";

            return el + "<input type='hidden' value='" + cellvalue + "' />";

        };

        function formatSelect(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            if (cellvalue != "PM3/4" && $(cellvalue).length > 0) return cellvalue;
            var data = [];
            if (options.colModel.formatoptions.data.memory != undefined) {
                if (options.colModel.formatoptions.data.key != undefined) {
                    var filter = [];
                    $.each(options.colModel.formatoptions.data.key, function (i) {
                        if (rowObject.childNodes == undefined) {
                            var cell =
                                "<div>" +
                                $("#" + options.gid).getCell(options.rowId, options.colModel.formatoptions.data.key[i]) +
                                "</div>";
                            filter.push($(cell).find("input").val());
                        }
                        else {
                            var match = 0;
                            $.each(colmodel, function (j) {
                                if (this.name == options.colModel.formatoptions.data.key[i])
                                    match = j;
                            });
                            filter.push(rowObject.childNodes[match].text);
                        }
                    });
                    var param = {
                        name: options.colModel.formatoptions.data.memory,
                        key: filter
                    };
                    data = gw_com_module.selectGet(param);
                }
                else if (options.colModel.formatoptions.data.by != undefined) {
                    var filter = [];
                    $.each(options.colModel.formatoptions.data.by, function (i) {
                        if (this.source != undefined)
                            filter.push(gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid));
                        else {
                            if (rowObject.childNodes == undefined) {
                                var cell =
                                    "<div>" +
                                    $("#" + options.gid).getCell(options.rowId, this.key) +
                                    "</div>";
                                filter.push($(cell).find("input").val());
                            }
                            else {
                                var key = this.key;
                                var match = 0;
                                $.each(colmodel, function (j) {
                                    if (this.name == key)
                                        match = j;
                                });
                                filter.push(rowObject.childNodes[match].text);
                            }
                        }
                    });
                    var param = {
                        name: options.colModel.formatoptions.data.memory,
                        key: filter
                    };
                    data = gw_com_module.selectGet(param);
                }
                else {
                    var param = {
                        name: options.colModel.formatoptions.data.memory
                    };
                    data = gw_com_module.selectGet(param);
                }
            }
            else
                data = options.colModel.formatoptions.data;
            var title = "";
            for (var format_j = 0; format_j < data.length; format_j++) {
                if (cellvalue == data[format_j].value) {
                    title = data[format_j].title;
                    break;
                }
            }
            return title + "<input type='hidden' value='" + cellvalue + "' />";

        };

        function formatLink(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            if ($.type(options.colModel.formatoptions.exceptionvalues) === "array") {
                if ($.inArray(cellvalue, options.colModel.formatoptions.exceptionvalues) >= 0) {
                    return formatMask(cellvalue, options, rowObject);
                }
            }
            var el =
                "<div" +
                ">" +
                "<a href='#'" +
                " style='color:blue; font-weight:normal;'";
            el = el +
                " onclick='" +
                "$(" + options.colModel.formatoptions.parent + "_data).setSelection(" + options.rowId + ");";
            var event = $.data($(targetobj + "_data")[0], "event");
            if (event[options.colModel.name + "_click"] != undefined) {
                el = el +
                    "var param = {" +
                    "type: \"GRID\"," +
                    "object: \"" + options.colModel.formatoptions.parent + "\"," +
                    "row: " + options.rowId + "," +
                    "element: \"" + options.colModel.name + "\"" +
                    "};" +
                    "if (!" + event[options.colModel.name + "_click"] + "(param)) return false;"
            }
            el = el +
                "'" +
                ">" +
                ((options.colModel.formatoptions.value != undefined) ?
                    options.colModel.formatoptions.value : cellvalue) +
                "</a>";
            el = el +
                "</div>";
            return el;

        };

        function entryText(value, options) {

            if (options.bind == "create") {
                var row = (options.id.split("_"))[0];
                if (gw_com_api.getValue(options.parent, row, "_CRUD", true) == "R") {
                    var el = document.createElement("div");
                    $(el).attr("bind", "create");
                    var content =
                        value +
                        "<input" +
                        " type='hidden'" +
                        " id='" + options.id + "'" +
                        " name='" + options.name + "'" +
                        " value='" + value + "'" +
                        ((options.mask != undefined) ? "mask='" + options.mask + "'" : "") +
                        ((options.display != undefined) ? "display='" + options.display + "'" : "") +
                        " />";
                    $(el).html(content);
                    return el;
                }
            }
            var el = document.createElement("input");
            $(el).attr('type', 'text');
            $(el).attr('id', options.id);
            $(el).attr('name', options.name);
            $(el).attr('value', value);
            if (options.maxlength != undefined)
                $(el).attr('maxlength', options.maxlength);
            if (options.title != undefined)
                $(el).attr('title', options.title);
            if (options.style != undefined)
                $(el).attr('class', options.style);
            if (options.width != undefined)
                $(el).css('width', (options.width - 10) + 'px');
            if (options.mask != undefined) {
                var param = {
                    targetobj: el,
                    mask: options.mask,
                    readonly: (options.mask == "search" && options.readonly != false) ? true : false,
                    format: "icon"
                };
                gw_com_module.textMask(param);
            }
            if (options.display)
                $(el).attr("display", true);
            if (options.readonly)
                $(el).attr("readonly", true);
            if (options.disable)
                $(el).attr("disabled", true);
            options.prev = value;
            $(el).focus(function () {
                var row = (this.id.split("_"))[0];
                if (row != $(targetobj + "_data").jqGrid('getGridParam', 'selrow')) {
                    var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                    if (crud.val() == "I" || crud.val() == "C")
                        $(targetobj + "_data").setSelection(row, false);
                    else
                        $(targetobj + "_data").setSelection(row);
                    //$(targetobj + "_data").setSelection(row, true, false);
                }
            });
            $(el).change(function () {
                var row = (this.id.split("_"))[0];
                var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                if (crud.val() == "R")
                    crud.val("U");
                else if (crud.val() == "I")
                    crud.val("C");
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemchanged != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: {
                            prev: options.prev,
                            current: this.value
                        }
                    };
                    if (!event.itemchanged(param))
                        return true;
                }
                options.prev = this.value;
                return true;
            });
            $(el).dblclick(function () {
                var row = (this.id.split("_"))[0];
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemdblclick != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: this.value
                    };
                    event.itemdblclick(param);
                    return false;
                }
            });
            $(el).keypress(function (e) {
                var row = (this.id.split("_"))[0];
                var event = $.data($(targetobj + "_data")[0], "event");
                if (e.which == 13 && event.itemkeyenter != undefined) {
                    var param = { type: "GRID", object: args.targetid, row: row, element: options.name, value: this.value };
                    event.itemkeyenter(param);
                    return false;
                }
                else if (event.itemkeypress != undefined) {
                    var param = { type: "GRID", object: args.targetid, row: row, element: options.name, value: this.value };
                    event.itemkeypress(param);
                    return false;
                }
                return true;
            });
            $(el).keyup(function (e) {
                var row = (this.id.split("_"))[0];
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemkeyup != undefined) {
                    var param = { type: "GRID", object: args.targetid, row: row, element: options.name, value: this.value };
                    event.itemkeyup(param);
                    return false;
                }
                return true;
            });
            return el;

        };

        function entryArea(value, options) {

            var el = document.createElement("textarea");
            $(el).attr('id', options.id);
            $(el).attr('name', options.name);
            $(el).attr('value', value);
            if (options.rows != undefined)
                $(el).attr('rows', options.rows);
            if (options.title != undefined)
                $(el).attr('title', options.title);
            if (options.style != undefined)
                $(el).attr('class', options.style);
            if (options.width != undefined)
                $(el).css('width', (options.width - 10) + 'px');
            if (options.mask != undefined) {
                var param = {
                    targetobj: el,
                    mask: options.mask,
                    readonly: (options.mask == "search" && options.readonly != false) ? true : false,
                    format: "icon"
                };
                gw_com_module.textMask(param);
            }
            if (options.display)
                $(el).attr("display", true);
            if (options.readonly)
                $(el).attr("readonly", true);
            if (options.disable)
                $(el).attr("disabled", true);
            options.prev = value;
            $(el).focus(function () {
                var row = (this.id.split("_"))[0];
                if (row != $(targetobj + "_data").jqGrid('getGridParam', 'selrow')) {
                    var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                    if (crud.val() == "I" || crud.val() == "C")
                        $(targetobj + "_data").setSelection(row, false);
                    else
                        $(targetobj + "_data").setSelection(row);
                    //$(targetobj + "_data").setSelection(row, true, false);
                }
            });
            $(el).change(function () {
                var row = (this.id.split("_"))[0];
                var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                if (crud.val() == "R")
                    crud.val("U");
                else if (crud.val() == "I")
                    crud.val("C");
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemchanged != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: {
                            prev: options.prev,
                            current: this.value
                        }
                    };
                    if (!event.itemchanged(param))
                        return true;
                }
                options.prev = this.value;
                return true;
            });
            return el;

        };

        function entryCheck(value, options) {

            var el = document.createElement("div");
            $(el).html(value);
            var evalue = $(el).find(":input[type=hidden]").val();
            var el = document.createElement("div");
            var content =
                //"<div" +
                //" style='display:none;'" +
                //">" +
                "<input" +
                " type='checkbox'" +
                " id='" + options.id + "'" +
                " name='" + options.name + "'" +
                " value='" + ((evalue == options.value) ? options.value : options.offval) + "'" +
                " onval='" + options.value + "'" +
                " offval='" + options.offval + "'" +
                ((options.disable) ? " disabled=true" : "") +
                ((options.display) ? " display=true" : "");
            if (evalue == options.value)
                content = content +
                    " checked=true";
            if (options.title != undefined)
                content = content +
                    " title='" + options.title + "'";
            if (options.style != undefined)
                content = content +
                    " class='" + options.style + "'";
            content = content +
                " style='margin:2px 3px 0px 0px; vertical-align:-2px;'" +
                " />";
            if (options.text != undefined)
                content = content +
                    "<span" +
                    " style='padding-left:2px;'>" +
                    options.text +
                    "</span>";
            //content = content +
            //	"</div>";
            $(el).html(content);
            options.prev = "";
            $(el).find("input").click(function () {
                var row = (this.id.split("_"))[0];
                if (row != $(targetobj + "_data").jqGrid('getGridParam', 'selrow')) {
                    var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                    if (crud.val() == "I" || crud.val() == "C")
                        $(targetobj + "_data").setSelection(row, false);
                    else
                        $(targetobj + "_data").setSelection(row);
                    //$(targetobj + "_data").setSelection(row, true, false);
                }
                return true;
            });
            $(el).find("input").change(function () {
                this.value =
                    (this.checked) ? options.value : options.offval;
                var row = (this.id.split("_"))[0];
                var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                if (crud.val() == "R")
                    crud.val("U");
                else if (crud.val() == "I")
                    crud.val("C");
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemchanged != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: {
                            prev: options.prev,
                            current: this.value
                        }
                    };
                    if (!event.itemchanged(param))
                        return true;
                }
                options.prev = this.value;
                return true;
            });
            return el;

        };

        function entryRadio(value, options) {

            var el = document.createElement("div");
            $(el).html(value);
            var evalue = $(el).find(":input[type=hidden]").val();
            var el = document.createElement("div");
            var content = "";
            $.each(options.child, function (j) {
                var num = j + 1;
                content = content +
                    "<input" +
                    " type='radio'" +
                    " id='" + options.id + "_" + num + "'" +
                    //" name='" + (options.id.split("_"))[0] + "_" + options.name + "'" +
                    " name='" + "radio_" + options.name + "_" + options.rowId + "'" +
                    " value='" + this.value + "'" +
                    ((this.value == evalue) ? " checked=true" : "") +
                    ((options.disable) ? " disabled=true" : "") +   // Edited by JJJ at 2019.12.06
                    " style='" + ((args.trans) ? "" : "margin: 0px 3px 1px 0px; vertical-align: -2px;") + "'" +
                    " />" +
                    "<span" +
                    " style='margin-top:0px;'>" +
                    this.title +
                    "</span>";
            });
            $(el).html(content);
            options.prev = evalue;
            $(el).find("input").click(function () {
                var row = (this.id.split("_"))[0];
                if (row != $(targetobj + "_data").jqGrid('getGridParam', 'selrow')) {
                    var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                    if (crud.val() == "I" || crud.val() == "C")
                        $(targetobj + "_data").setSelection(row, false);
                    else
                        $(targetobj + "_data").setSelection(row);
                    //$(targetobj + "_data").setSelection(row, true, false);
                }
                return true;
            });
            $(el).find("input").change(function () {
                var row = (this.id.split("_"))[0];
                var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                if (crud.val() == "R")
                    crud.val("U");
                else if (crud.val() == "I")
                    crud.val("C");
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemchanged != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: {
                            prev: options.prev,
                            current: this.value
                        }
                    };
                    if (!event.itemchanged(param))
                        return true;
                }
                options.prev = this.value;
                return true;
            });
            return el;

        };

        function entrySelect(value, options) {

            if (options.bind == "create") {
                var row = (options.id.split("_"))[0];
                if (gw_com_api.getValue(options.parent, row, "_CRUD", true) == "R") {
                    var el = document.createElement("div");
                    $(el).attr("bind", "create");
                    var data = [];
                    if (options.data.memory != undefined) {
                        if (options.data.key != undefined) {
                            var filter = [];
                            $.each(options.data.key, function (j) {
                                var cell = $("#" + options.parent + "_data").getCell(row, options.data.key[j]);
                                filter.push($(cell).find("select :selected").val());
                            });
                            var param = {
                                name: options.data.memory,
                                key: filter
                            };
                            data = gw_com_module.selectGet(param);
                        }
                        else if (options.data.by != undefined) {
                            var filter = [];
                            $.each(options.data.by, function (j) {
                                if (this.source != undefined)
                                    filter.push(gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid));
                                else {
                                    var cell = $("#" + options.parent + "_data").getCell(row, this.key);
                                    filter.push($(cell).find("select :selected").val());
                                }
                            });
                            var param = {
                                name: options.data.memory,
                                key: filter
                            };
                            data = gw_com_module.selectGet(param);
                        }
                        else {
                            var param = {
                                name: options.data.memory
                            };
                            data = gw_com_module.selectGet(param);
                        }
                    }
                    else
                        data = options.data;
                    var current = $("<div>" + value + "</div>").find("input").val();
                    var title = "";
                    for (var edit_j = 0; edit_j < data.length; edit_j++) {
                        if (current == data[edit_j].value) {
                            title = data[edit_j].title;
                            break;
                        }
                    }
                    var content =
                        title +
                        "<input" +
                        " type='hidden'" +
                        " id='" + options.id + "'" +
                        " name='" + options.name + "'" +
                        " value='" + ((current != undefined) ? current : ((value != undefined) ? value : "")) + "'" +
                        " />";
                    $(el).html(content);
                    return el;
                }
            }
            var el = document.createElement("select");
            $(el).attr('id', options.id);
            $(el).attr('name', options.name);
            //$(el).attr('size', options.size);
            var row = (options.id.split("_"))[0];
            var data = [];
            if (options.data.memory != undefined) {
                if (options.data.key != undefined) {
                    var filter = [];
                    $.each(options.data.key, function (j) {
                        var cell = $("#" + options.parent + "_data").getCell(row, options.data.key[j]);
                        filter.push($(cell).find("select :selected").val());
                    });
                    var param = {
                        name: options.data.memory,
                        key: filter
                    };
                    data = gw_com_module.selectGet(param);
                }
                else if (options.data.by != undefined) {
                    var filter = [];
                    $.each(options.data.by, function (j) {
                        if (this.source != undefined)
                            filter.push(gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid));
                        else {
                            var cell = $("#" + options.parent + "_data").getCell(row, this.key);
                            filter.push($(cell).find("select :selected").val());
                        }
                    });
                    var param = {
                        name: options.data.memory,
                        key: filter
                    };
                    data = gw_com_module.selectGet(param);
                }
                else {
                    var param = {
                        name: options.data.memory
                    };
                    data = gw_com_module.selectGet(param);
                }
            }
            else
                data = options.data;
            var current = $("<div>" + value + "</div>").find("input").val();
            if (options.data.unshift != undefined) {
                $.each(options.data.unshift, function (j) {
                    if ($.browser.msie)
                        $(el)[0].add(new Option(this.title, this.value));
                    else
                        $(el)[0].add(new Option(this.title, this.value), null);
                });
            }
            $.each(data, function (j) {
                if ($.browser.msie) {
                    $(el)[0].add(new Option(this.title, this.value));
                }
                else {
                    $(el)[0].add(new Option(this.title, this.value), null);
                }
            });
            if (options.data.push != undefined) {
                $.each(options.data.push, function (j) {
                    if ($.browser.msie)
                        $(el)[0].add(new Option(this.title, this.value));
                    else
                        $(el)[0].add(new Option(this.title, this.value), null);
                });
            }
            if (current != undefined)
                $(el).attr("value", current);
            else if (value != undefined)
                $(el).attr("value", value);
            else
                $(el).attr("value", "");
            if (options.readonly)
                $(el).attr("readonly", true);
            if (options.disable)
                $(el).attr("disabled", true);
            if (options.style != undefined)
                $(el).attr('class', options.style);
            if (options.width != undefined)
                $(el).css('width', (options.width - 4) + 'px');
            options.prev = "";
            $(el).focus(function () {
                if (row != $(targetobj + "_data").jqGrid('getGridParam', 'selrow')) {
                    var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                    if (crud.val() == "I" || crud.val() == "C")
                        $(targetobj + "_data").setSelection(row, false);
                    else
                        $(targetobj + "_data").setSelection(row);
                    //$(targetobj + "_data").setSelection(row, true, false);
                }
            });
            $(el).change(function () {
                if (options.change != undefined) {
                    $.each(options.change, function (i) {
                        var filter = [];
                        if (this.key != undefined) {
                            $.each(this.key, function (j) {
                                filter.push($(targetobj + "_form :input[id='" + row + "_" + this + "']").val());
                            });
                        }
                        else if (this.by != undefined) {
                            $.each(this.by, function (j) {
                                filter.push(
                                    (this.source != undefined)
                                        ? gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid)
                                        : $(targetobj + "_form :input[id='" + row + "_" + this.key + "']").val()
                                );
                            });
                        }
                        var param = {
                            name: this.memory,
                            key: filter
                        };
                        data = gw_com_module.selectGet(param);
                        var target = targetobj + "_form :input[id='" + row + "_" + this.name + "']";
                        $(target + " option").remove();
                        if (this.unshift != undefined) {
                            $.each(this.unshift, function (j) {
                                if ($.browser.msie)
                                    $(target)[0].add(new Option(this.title, this.value));
                                else
                                    $(target)[0].add(new Option(this.title, this.value), null);
                            });
                        }
                        $.each(data, function (j) {
                            if ($.browser.msie)
                                $(target)[0].add(new Option(this.title, this.value));
                            else
                                $(target)[0].add(new Option(this.title, this.value), null);
                        });
                        if (this.push != undefined) {
                            $.each(this.push, function (j) {
                                if ($.browser.msie)
                                    $(target)[0].add(new Option(this.title, this.value));
                                else
                                    $(target)[0].add(new Option(this.title, this.value), null);
                            });
                        }
                    });
                }
                var crud = $(targetobj + "_form :input[id='" + row + "__CRUD']");
                if (crud.val() == "R")
                    crud.val("U");
                else if (crud.val() == "I")
                    crud.val("C");
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemchanged != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: {
                            prev: options.prev,
                            current: this.value
                        }
                    };
                    if (!event.itemchanged(param))
                        return true;
                }
                options.prev = this.value;
                return true;
            });
            return el;

        };

        function entryHidden(value, options) {

            var el = document.createElement("div");
            var content =
                value +
                "<input" +
                " type='hidden'" +
                " id='" + options.id + "'" +
                " name='" + options.name + "'" +
                " value='" + value + "'";
            if (options.display)
                content = content + " display=true";
            if (options.mask != undefined)
                content = content +
                    " mask='" + options.mask + "'";
            content = content +
                " />";
            $(el).html(content);
            return el;

        };

        function valueDefault(elem, operation, value) {

            if (operation == 'get') {
                return ($(elem).attr("bind") == "create")
                    //? $(elem).text() : $(elem).val();
                    ? $($(elem).find("input")).val() : $(elem).val();
            } else if (operation == 'set') {
                if ($(elem).attr("bind") == "create") {
                    //$(elem).text(value);
                    $($(elem).find("input")).val(value);
                }
                else
                    $(elem).val(value);
            }

        };

        function valueCheck(elem, operation, value) {

            var el = $(elem).find("input");
            if (operation == 'get') {
                if ($(el).attr("checked"))
                    return $(el).attr("value");
                else
                    return $(el).attr("offval");
            } else if (operation == 'set') {
                if (value == $(el).attr("value"))
                    $(el).attr("checked", true);
                else
                    $(el).attr("checked", false);
            }

        };

        function valueRadio(elem, operation, value) {

            var el = $(elem).find("input");
            if (operation == 'get') {
                var get = "";
                $.each(el, function () {
                    if ($(this).attr("checked"))
                        get = $(this).val();
                });
                return get;
            } else if (operation == 'set') {
                $.each(el, function () {
                    if ($(this).val() == value)
                        $(this).attr("checked", true);
                    else
                        $(this).attr("checked", false);
                });
            }

        };

        function valueHidden(elem, operation, value) {

            if (operation == 'get') {
                return $(elem).text();
            } else if (operation == 'set') {
                $(elem).text(value);
                $($(elem).find("input")).val(value);
            }

        };

    },

    // create. (sheet)
    sheetCreate: function (args) {

        var targetobj = "#" + args.targetid;
        if (gw_com_module.v_Option.authority.usable) {
            if (gw_com_module.v_Option.authority.control == "R" && args.editable != undefined)
                args.editable = undefined;
        }
        $(targetobj).attr("sheet", true);
        var content = "";
        /*
        if (args.width) {
        $(targetobj).wrap(
        "<div style='width:" + args.width + "px;'>");
        }
        */
        $(targetobj).wrap(
            "<div style='width:100%;'>");
        content = content +
            "<div id='" + args.targetid + "_obj'" + /* class='gridwrapper'*/" style='width:100% margin:0; padding:0;'>";
        //if (args.editable != undefined) {
        content = content +
            "<form" +
            " id='" + args.targetid + "_form'" +
            " action = ''>";
        //}
        content = content +
            "<table" +
            " id='" + args.targetid + "_data'" +
            " name='" + args.targetid + "_data'" +
            ((args.query != undefined) ? "query='" + args.query + "'" : "") +
            ">" +
            "</table>";
        //if (args.editable != undefined) {
        content = content +
            "</form>";
        //}
        if (args.pager != false) {
            content = content +
                "<div" +
                " id='" + args.targetid + "_pager'>" +
                "</div>";
        }
        content = content +
            "</div>";
        $(targetobj).attr("title", args.title);
        $(targetobj).html(content);
        if (args.editable != undefined) {
            if (args.editable.validate == true) {
                $($(targetobj + "_form")).validate({
                    meta: "validate",
                    onkeyup: false,
                    onclick: false,
                    focusInvalid: false,
                    focusCleanup: false,
                    onfocusout: false,
                    ignoreTitle: true,
                    unhighlight: function (element, errorClass) {
                        $(element).removeClass("error_highlight");
                    },
                    showErrors: function (errorMap, errorList) {
                        if (errorList.length > 0) {
                            var msg = "* 입력 오류 *\n\n";
                            $.each(errorList, function (i) {
                                msg = msg + errorList[i].element.title + " - " + errorList[i].message + "\n";
                                $(errorList[i].element).addClass("error_highlight");
                            });
                            errorList[0].element.focus();
                            if (gw_com_module.v_Option.message) {
                                var message = [
                                    { text: "NOVALIDATE" }
                                ];
                                if (args.title != undefined)
                                    message.unshift({ text: "◈ " + args.title + "<br><br>", align: "left", margin: 30 });
                                gw_com_api.messageBox(message);
                            }
                            else
                                gw_com_api.showMessage(msg);
                        }
                    }
                });
            }
            $.data($(targetobj + "_data")[0], "editable", {
                master: (args.editable.master) ? true : false,
                multi: (args.editable.multi) ? true : false,
                bind: (args.editable.bind != undefined) ? args.editable.bind : false,
                focus: (args.editable.focus != undefined) ? args.editable.focus : false
            });
        }
        if (args.selectable) {
            var wrapperobj = "#" + args.targetid + "_obj";
            //$(wrapperobj).addClass("gridwrapper");
            $(wrapperobj).addClass("selectedlayer");
            /*
            $(wrapperobj).click(function(i) {
            if (gw_com_module.v_Current.object != null
            && gw_com_module.v_Current.object != args.targetid)
            $("#" + gw_com_module.v_Current.object + "_obj").css("border-color", "#ffffff");
            //$("#" + gw_com_module.v_Current.object + "_obj").removeClass("selectedlayer");
            gw_com_module.v_Current.object = args.targetid;
            //$(wrapperobj).addClass("selectedlayer");
            $("#" + gw_com_module.v_Current.object + "_obj").css("border-color", "#b1b1cc");
            });
            */
        }

        var header = "";
        var column = "";
        var view = "";
        var option = { cells: [] };
        var datepicker = [];
        var colname = [];
        var colmodel = [];
        $.each(args.element, function (i) {
            column = column +
                ((i > 0) ? "," : "") + encodeURIComponent(this.name);
            if (this.excel || this.hidden != true) {
                header = header +
                    ((i > 0) ? "," : "") + encodeURIComponent((this.lead != undefined) ? this.lead : this.header);
                view = view +
                    ((i > 0) ? "," : "") + encodeURIComponent((this.view != undefined) ? this.view : this.name);
            }
            option[this.name] = {};
            var format = (this.format != undefined) ? this.format.type : "text";
            var edit = (this.editable != undefined) ? this.editable.type : false;
            option.cells.push(this.name);
            option[this.name].format = format;
            option[this.name].edit = edit;
            option[this.name].mask = (this.mask != undefined) ? this.mask : "";
            if (this.display) option[this.name].display = true;
            colname.push(this.header);
            var model = {
                name: this.name,
                index: this.name
            };
            if (this.hidden)
                model.hidden = true;
            if (this.width != undefined)
                model.width = this.width;
            if (this.align != undefined)
                model.align = this.align;
            switch (format) {
                case "checkbox":
                    {
                        model.formatoptions = {
                            title: this.format.title,
                            value: this.format.value
                        };
                        model.formatter = formatCheck;
                    }
                    break;
                case "radio":
                    {
                        model.formatoptions = { child: this.format.child };
                        model.formatter = formatRadio;
                    }
                    break;
                case "select":
                    {
                        model.formatoptions = {
                            data: this.format.data
                        };
                        model.formatter = formatSelect;
                    }
                    break;
                case "label":
                    {
                        model.formatter = formatLabel;
                    }
                    break;
                case "text":
                    {
                        if (this.mask != undefined) {
                            model.formatoptions = {
                                mask: this.mask
                            };
                            model.formatter = formatMask;
                            model.unformatter = unformatMask;
                        }
                        else if (this.fix != undefined) {
                            model.formatoptions = {
                                fix: this.fix
                            };
                            model.formatter = formatFix;
                            //model.unformatter = unformatMask;
                        }
                    }
                    break;
                case "link":
                    {
                        model.formatoptions = {
                            parent: args.targetid,
                            value: this.format.value
                        };
                        model.formatter = formatLink;
                    }
                    break;

            }
            if (edit != false) {
                model.editable = true;
                model.edittype = "custom";
                model.edittag = edit;
                switch (edit) {
                    case "text":
                        {
                            model.editoptions = {
                                parent: args.targetid,
                                bind: this.editable.bind,
                                width: (this.editable.width != undefined) ? this.editable.width : this.width,
                                custom_element: entryText,
                                custom_value: valueDefault
                            };
                            if (this.editable.maxlength != undefined)
                                model.editoptions.maxlength = this.editable.maxlength;
                        }
                        break;
                    case "checkbox":
                        {
                            model.editoptions = {
                                custom_element: entryCheck,
                                custom_value: valueCheck
                            };
                            if (this.editable.title != undefined)
                                model.editoptions.text = this.editable.title;
                            model.editoptions.value = this.editable.value;
                            model.editoptions.offval = this.editable.offval;
                        }
                        break;
                    case "select":
                        {
                            model.editoptions = {
                                parent: args.targetid,
                                bind: this.editable.bind,
                                width: (this.editable.width != undefined) ? this.editable.width : this.width,
                                custom_element: entrySelect,
                                custom_value: valueDefault
                            };
                            model.editoptions.size =
                                (this.editable.size != undefined) ? this.editable.size : 1;
                            if (this.editable.data != undefined) {
                                model.editoptions.data = this.editable.data;
                            }
                            if (this.editable.change != undefined) {
                                model.editoptions.change = this.editable.change;
                            }
                        }
                        break;
                    case "save":
                    case "hidden":
                        {
                            model.editoptions = {
                                custom_element: entryHidden,
                                custom_value: valueHidden
                            };
                        }
                        break;
                }
                if (this.mask != undefined) {
                    if (edit == "text" && this.mask == "date-ymd") {
                        model.editoptions.width = model.editoptions.width - 18;
                        datepicker.push(model.name);
                    }
                    model.editoptions.mask = this.mask;
                }
                if (this.display)
                    model.editoptions.display = this.display;
                var estyle = "";
                if (args.editable) {
                    estyle = args.targetid + "_editchangable";
                }
                if (this.editable.validate != undefined) {
                    model.editoptions.title = this.editable.validate.message;
                    estyle = estyle +
                        " {validate: { " + this.editable.validate.rule + " }}";
                }
                if (estyle != "")
                    model.editoptions.style = estyle;
                model.editoptions.readonly = this.editable.readonly;
                model.editoptions.disable = this.editable.disable;
            }
            if (this.summary != undefined) {
                model.summaryType =
                    (this.summary.type == undefined) ? "count" : this.summary.type;
                var summary = "{0}";
                if (this.summary.title != undefined)
                    summary = "<span style='font-weight:normal;'>" + this.summary.title + "</span>";
                //summary = this.summary.title;
                if (this.summary.prefix != undefined)
                    summary = this.summary.prefix + summary;
                if (this.summary.suffix != undefined)
                    summary = summary + this.summary.suffix;
                model.summaryTpl = "<span style='font-weight:bold;'>" + summary + "</span>";
            }
            if (this.style != undefined) {
                var attr = this.style;
                model.cellattr = function (rowId, tv, rawObject, cm, rdata) {
                    if (attr.bgcolor != undefined)
                        return "style=' background-color:" + attr.bgcolor + "'";
                };
            }
            colmodel.push(model);
        });
        colname.unshift("No.");
        colmodel.unshift({
            name: '_NO',
            index: '_NO',
            sorttype: 'int',
            width: 30,
            align: 'center',
            hidden: (args.number) ? false : true
        });
        option.cells.push("_NO");
        option["_NO"] = {
            format: "text",
            edit: false,
            mask: ""
        }
        colname.push("_CRUD");
        colmodel.push({
            name: '_CRUD',
            index: '_CRUD',
            hidden: true,
            editable: true,
            edittype: 'text'
        });
        option.cells.push("_CRUD");
        option["_CRUD"] = {
            format: "text",
            edit: "text",
            mask: ""
        }
        var obj = {
            header: header,
            column: column,
            view: view,
            option: option,
            datepicker: datepicker,
            buffer: {
                insert: [],
                remove: []
            },
            current: null
        };
        gw_com_module.v_Object[args.targetid] = obj;

        $(targetobj).attr("row", "");
        $(targetobj).attr("cell", "");
        var option = {
            //url: url,
            //datatype: 'xml',
            datatype: '',
            //autoencode: true,
            mtype: 'GET',
            colNames: colname,
            colModel: colmodel,
            rowNum: (args.dynamic) ? 50 : 1000000,
            rowTotal: 1000000,
            caption: (args.caption) ? "◈ " + args.title : "",
            width: (args.width != undefined) ? args.width : "100%",
            height: args.height,
            multiselect: (args.multi) ? true : false,
            shrinkToFit: false,
            loadonce: true,
            gridview: (args.color != undefined || args.subgrid != undefined) ? false : true,
            scroll: (args.dynamic) ? true : 0,
            loadui: false,
            loadtext: "처리 중입니다...",
            scrollrows: true,
            cellEdit: true,
            cellsubmit: "clientArray",
            afterEditCell: function (rowid, cellname, value, iRow, iCol) {
                //var editable = gw_com_module.v_Object[args.targetid].option[cellname].edit;
                //if (editable != false && editable != "hidden") {
                $(targetobj).attr("row", rowid);
                $(targetobj).attr("cell", cellname);
                //}
            },
            afterSaveCell: function (rowid, cellname, value, iRow, iCol) {
                $(targetobj).attr("row", "");
                $(targetobj).attr("cell", "");
            },
            afterRestoreCell: function (rowid, value, iRow, iCol) {
                $(targetobj).attr("row", "");
                $(targetobj).attr("cell", "");
            },
            afterInsertRow: function (rowid, rowdata, rowelem) {
                if (args.color != undefined) {
                    if (args.color.rule != undefined) {
                        $.each(args.color.rule, function () {
                            var style = (this.color != undefined) ? "color" : "background-color";
                            var color = (this.color != undefined) ? this.color : this.bgcolor;
                            $.each(this.element, function () {
                                if (style == "color")
                                    $(targetobj + "_data").jqGrid('setCell', rowid, this, '', { "color": color });
                                else
                                    $(targetobj + "_data").jqGrid('setCell', rowid, this, '', { "background-color": color });
                            });
                        });
                    }
                    else {
                        if (rowdata.color != undefined) {
                            if (args.color.row) {
                                $.each(rowdata, function (col_i) {
                                    $(targetobj + "_data").jqGrid('setCell', rowid, col_i, '', { 'color': rowdata.color });
                                });
                            }
                            else {
                                $.each(args.color.element, function () {
                                    $(targetobj + "_data").jqGrid('setCell', rowid, this, '', { 'color': rowdata.color });
                                });
                            }
                        }
                        else if (rowdata.bgcolor != undefined) {
                            if (args.color.row) {
                                $.each(rowdata, function (col_i) {
                                    $(targetobj + "_data").jqGrid('setCell', rowid, col_i, '', { 'background-color': rowdata.bgcolor });
                                });
                            }
                            else {
                                $.each(args.color.element, function () {
                                    $(targetobj + "_data").jqGrid('setCell', rowid, this, '', { 'background-color': rowdata.bgcolor });
                                });
                            }
                        }
                    }
                }
            },
            ondblClickRow: function (rowid, iRow, iCol, e) {
                var param = {
                    type: "GRID",
                    object: args.targetid,
                    row: rowid,
                    element: gw_com_api.getColName(args.targetid, iCol)
                }
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.rowdblclick != undefined)
                    return event.rowdblclick(param);
            },
            gridComplete: function () {
                completeProcess();
            },
            loadComplete: function (response) {
                successRequest(response);
            },
            loadError: function (xmlRequest, status, error) {
                alert(
                    xmlRequest.status + '\r\n' + xmlRequest.statusText + '\r\n' + xmlRequest.responseText);
                errorRequest();
            }
        };
        if (args.pager != false) {
            option.pager = targetobj + "_pager";
            option.viewrecords = true;
            option.pgbuttons = false;
            option.pginput = false;
            option.pgtext = false;
        }
        if (args.treegrid != undefined) {
            option.treeGrid = true;
            //option.treeGridModel = "nested";
            option.treeGridModel = "adjacency";
            option.treedatatype = "xml";
            option.treeIcons = { leaf: "ui-icon-document-b" };
            option.ExpandColumn = args.treegrid.element;
        }
        if (args.subgrid != undefined) {
            option.subGrid = true;
            option.subGridRowExpanded = function (sub_id, row_id) {

                var sub_data, sub_pager;
                sub_data = sub_id + "_t";
                sub_pager = "p_" + sub_data;
                $("#" + sub_id)
                    .html("<table id='" + sub_data + "' class='scroll'></table><div id='" + sub_pager + "' class='scroll'></div>");
                var sub_column = "";
                var sub_colname = [];
                var sub_colmodel = [];
                $.each(args.subgrid.element, function (sub_i) {
                    sub_column = sub_column +
                        ((sub_i > 0) ? "," : "") + encodeURIComponent(this.name);
                    var sub_format = (this.format != undefined) ? this.format.type : "text";
                    sub_colname.push(this.header);
                    var sub_model = {
                        name: this.name,
                        index: this.name
                    };
                    switch (sub_format) {
                        case "checkbox":
                            {
                                sub_model.formatoptions = {
                                    title: this.format.title,
                                    value: this.format.value
                                };
                                sub_model.formatter = formatCheck;
                            }
                            break;
                        case "radio":
                            {
                                sub_model.formatoptions = { child: this.format.child };
                                sub_model.formatter = formatRadio;
                            }
                            break;
                        case "select":
                            {
                                sub_model.formatoptions = {
                                    data: this.format.data
                                };
                                sub_model.formatter = formatSelect;
                            }
                            break;
                        case "text":
                            {
                                if (this.mask != undefined) {
                                    sub_model.formatoptions = {
                                        mask: this.mask
                                    };
                                    sub_model.formatter = formatMask;
                                    sub_model.unformatter = unformatMask;
                                }
                                else if (this.fix != undefined) {
                                    model.formatoptions = {
                                        fix: this.fix
                                    };
                                    model.formatter = formatFix;
                                    //model.unformatter = unformatMask;
                                }
                            }
                            break;
                    }
                    if (this.hidden)
                        sub_model.hidden = true;
                    if (this.width != undefined)
                        sub_model.width = this.width;
                    if (this.align != undefined)
                        sub_model.align = this.align;
                    if (this.style != undefined) {
                        var attr = this.style;
                        sub_model.cellattr = function (rowId, tv, rawObject, cm, rdata) {
                            if (attr.bgcolor != undefined)
                                return "style=' background-color:" + attr.bgcolor + "'";
                        };
                    }
                    sub_colmodel.push(sub_model);
                });
                sub_colname.unshift("No.");
                sub_colmodel.unshift({
                    name: '_NO',
                    index: '_NO',
                    sorttype: 'int',
                    width: 30,
                    align: 'center',
                    hidden: (args.subgrid.number) ? false : true
                });
                sub_colname.push("_CRUD");
                sub_colmodel.push({
                    name: '_CRUD',
                    index: '_CRUD',
                    hidden: true,
                    editable: true,
                    edittype: 'text'
                });

                var sub_url = (args.subgrid.url != undefined)
                    ? args.subgrid.url : "../Service/svc_Retrieve_XML.aspx";
                var sub_params =
                    "?QRY_ID=" + args.subgrid.query +
                    "&QRY_COLS=" + sub_column +
                    "&CRUD=R" +
                    "&OPTION=NONE";
                $.each(args.subgrid.argument, function (sub_i) {
                    var sub_value =
                        gw_com_api.getValue(args.targetid, row_id, this.name, true);
                    sub_params = sub_params + "&" +
                        encodeURIComponent(this.argument) + "=" +
                        encodeURIComponent(sub_value);
                });
                var sub_option = {
                    //url: url,
                    //datatype: 'xml',
                    url: sub_url + sub_params,
                    datatype: 'xml',
                    mtype: 'GET',
                    colNames: sub_colname,
                    colModel: sub_colmodel,
                    rowNum: (args.subgrid.dynamic) ? 50 : 1000000,
                    rowTotal: 1000000,
                    caption: (args.subgrid.caption) ? "◈ " + args.subgrid.title : "",
                    width: (args.subgrid.width != undefined) ? args.subgrid.width : "100%",
                    height: args.subgrid.height,
                    //multiselect: (args.subgrid.multi) ? true : false,
                    shrinkToFit: false,
                    loadonce: true,
                    //gridview: true,
                    scroll: (args.subgrid.dynamic) ? true : 0,
                    //loadui: false,
                    loadtext: "처리 중입니다..."
                };
                $("#" + sub_data).jqGrid(sub_option);

            };
            option.subGridRowColapsed = function (sub_id, row_id) {
                var sub_data = sub_id + "_t";
                $("#" + sub_data).remove();
            };
        }
        if (args.group != undefined) {
            option.grouping = true;
            option.groupingView = {
                groupField: [],
                groupColumnShow: [],
                groupText: [],
                groupCollapse: [],
                groupOrder: [],
                groupSummary: []
            };
            $.each(args.group, function (i) {
                option.groupingView.groupField.push(this.element);
                option.groupingView.groupColumnShow.push((this.show) ? true : false);
                option.groupingView.groupText.push(
                    "<div style='margin-top:3px; font-weight:" + ((this.bold == false) ? "normal" : "bold") + ";'>{0}</div>");
                option.groupingView.groupCollapse.push(true);
                //option.groupingView.groupOrder.push((this.desc) ? "desc" : "asc");
                option.groupingView.groupSummary.push((this.summary) ? true : false);
            });
            option.groupingView.groupDataSorted = false;
            option.groupingView.showSummaryOnHide = true;
        }
        $(targetobj + "_data").jqGrid(option);
        if (args.nogroup)
            $(targetobj + "_data").jqGrid('groupingRemove', true);
        $(targetobj + "_data").jqGrid('bindKeys', {
            "onEnter": function (rowid, a) {
                var param = {
                    type: "GRID",
                    object: args.targetid,
                    row: rowid
                }
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.rowkeyenter != undefined) {
                    event.rowkeyenter(param);
                    return false;
                }
                return true;
            },
            "updownKey": (args.key) ? true : false
        });
        $.data($(targetobj + "_data")[0], "event", {});
        if (args.multi)
            $(targetobj + "_data").hideCol('cb');
        if (args.show == false) {
            $(targetobj).hide();
        }
        if ($("#navContext").length > 0) {
            $("#" + args.targetid).contextMenu(
                { menu: 'navContext' },
                function (action, el, pos) {
                    gw_com_module.gridDownload({ targetid: args.targetid });
                }
            );
        }

        function completeProcess() {

            if (args.processed)
                return;

            if (args.handler_processed != undefined)
                args.handler_processed();

        };

        function successRequest(response) {

            if (args.processed)
                return;

            if (args.show == false)
                $(targetobj).hide();
            else if (gw_com_module.v_Current.loaded)
                gw_com_module.informSize();

            if (args.handler_success != undefined)
                args.handler_success(response.tData);

            args.processed = true;

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();

        };

        function formatLabel(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            var el =
                "<div style='margin-top: 3px;'>" +
                cellvalue +
                "</div>";
            return el;

        };

        function formatMask(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            switch (options.colModel.formatoptions.mask) {
                case "date-ym":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 4) + "-";
                        format = format + cellvalue.substr(4, 2);
                        return format;
                    };
                case "date-ymd":
                    {
                        var value = cellvalue.split("-");
                        if (cellvalue == "" || value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 4) + "-";
                        format = format + cellvalue.substr(4, 2) + "-";
                        format = format + cellvalue.substr(6, 2);
                        return format;
                    };
                case "time-hh":
                    {
                        var format = (cellvalue != "") ? cellvalue + "시" : cellvalue;
                        return format;
                    };
                case "time-hm":
                    {
                        var value = cellvalue.split(":");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 2) + ":";
                        format = format + cellvalue.substr(2, 2);
                        return format;
                    };
                case "biz-no":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 3) + "-";
                        format = format + cellvalue.substr(3, 2) + "-";
                        format = format + cellvalue.substr(5, 5);
                        return format;
                    };
                case "person-id":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 6) + "-";
                        format = format + cellvalue.substr(6, 7);
                        return format;
                    };
                case "currency-ko":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'ko-KR' });
                        return $(el).val();
                    };
                case "numeric-int":
                case "currency-int":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'int' });
                        return $(el).val();
                    };
                case "numeric-float":
                case "currency-none":
                case "currency-float":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float' });
                        return $(el).val();
                    };
                case "numeric-float1":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float1' });
                        return $(el).val();
                    };
                case "numeric-float4":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float4' });
                        return $(el).val();
                    };
            }
            return cellvalue;

        };

        function unformatMask(cellvalue, options, cellObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            switch (options.colModel.formatoptions.mask) {
                case "date-ym":
                case "date-ymd":
                case "biz-no":
                case "person-id":
                    {
                        cellvalue = cellvalue.replace(/\_/g, "");
                        var value = cellvalue.split("-");
                        return value.join("");
                        //var format = "";
                        //$.each(value, function (i) {
                        //    format = format + this;
                        //});
                        //return format;
                    }
                case "time-hh":
                    {
                        var format = cellvalue.replace(/\_/g, "").replace("시", "");
                        return format;
                    }
                case "time-hm":
                    {
                        cellvalue = cellvalue.replace(/\_/g, "");
                        var value = cellvalue.split(":");
                        return value.join("");
                        //var format = "";
                        //$.each(value, function (i) {
                        //    format = format + this;
                        //});
                        //return format;
                    }
                case "numeric-int":
                case "currency-ko":
                case "currency-int":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        return $(el).asNumber({ parseType: 'Int' });
                    }
                    break;
                case "numeric-float":
                case "currency-none":
                case "currency-float":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        return $(el).asNumber({ parseType: 'float' });
                    }
                    break;
                case "numeric-float1":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        return $(el).asNumber({ parseType: 'float1' });
                    }
                    break;
                case "numeric-float4":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        return $(el).asNumber({ parseType: 'float4' });
                    }
                    break;
            }
            return cellvalue;

        };

        function formatFix(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            switch (options.colModel.formatoptions.fix.mask) {
                case "date-ym":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 4) + "-";
                        format = format + cellvalue.substr(4, 2);
                        cellvalue = format;
                    }
                    break;
                case "date-ymd":
                    {
                        var value = cellvalue.split("-");
                        if (cellvalue == "" || value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 4) + "-";
                        format = format + cellvalue.substr(4, 2) + "-";
                        format = format + cellvalue.substr(6, 2);
                        cellvalue = format;
                    }
                    break;
                case "time-hh":
                    {
                        var format = (cellvalue != "") ? cellvalue + "시" : cellvalue;
                        cellvalue = format;
                    };
                    break;
                case "time-hm":
                    {
                        var value = cellvalue.split(":");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 2) + ":";
                        format = format + cellvalue.substr(2, 2);
                        cellvalue = format;
                    }
                    break;
                case "biz-no":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 3) + "-";
                        format = format + cellvalue.substr(3, 2) + "-";
                        format = format + cellvalue.substr(5, 5);
                        cellvalue = format;
                    }
                    break;
                case "person-id":
                    {
                        var value = cellvalue.split("-");
                        if (value.length > 1) return cellvalue;
                        var format = cellvalue.substr(0, 6) + "-";
                        format = format + cellvalue.substr(6, 7);
                        cellvalue = format;
                    }
                    break;
                case "currency-ko":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'ko-KR' });
                        cellvalue = $(el).val();
                    }
                    break;
                case "numeric-int":
                case "currency-int":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'int' });
                        cellvalue = $(el).val();
                    }
                    break;
                case "numeric-float":
                case "currency-none":
                case "currency-float":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float' });
                        cellvalue = $(el).val();
                    }
                    break;
                case "numeric-float1":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float1' });
                        cellvalue = $(el).val();
                    }
                    break;
                case "numeric-float4":
                    {
                        var el = document.createElement("input");
                        el.type = "text";
                        el.value = cellvalue;
                        $(el).formatCurrency({ colorize: true, region: 'float4' });
                        cellvalue = $(el).val();
                    }
                    break;
            }
            if (options.colModel.formatoptions.fix.suffix != undefined)
                cellvalue = cellvalue + " " + options.colModel.formatoptions.fix.suffix;
            if (options.colModel.formatoptions.fix.margin != undefined) {
                for (var space = 0; space < options.colModel.formatoptions.fix.margin; space++)
                    cellvalue = cellvalue + " ";
            }
            return cellvalue;

        };

        function formatCheck(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            if ($(cellvalue).length > 0) return cellvalue;
            var el =
                "<div" +
                //" style='display:none;'" +
                ">" +
                "<input" +
                " type='checkbox'" +
                " value='" + cellvalue + "'" +
                " disabled=true";
            if (options.colModel.formatoptions.value == cellvalue)
                el = el +
                    " checked=true";
            el = el +
                " style='margin:2px 3px 0px 0px; vertical-align:-2px;'" +
                " />";
            if (options.colModel.formatoptions.title != undefined)
                el = el +
                    "<span" +
                    " style='padding-left:2px;'>" +
                    options.colModel.formatoptions.title +
                    "</span>";
            el = el +
                "</div>";
            return el + "<input type='hidden' value='" + cellvalue + "' />";

        };

        // Added by JJJ at 2019.12.06
        function formatRadio(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            if ($(cellvalue).length > 0) return cellvalue;

            var el = "<div" +
                //" style='display:none;'" +
                ">";
            $.each(options.colModel.formatoptions.child, function () {
                el = el +
                    "<input" +
                    " type='radio'" +
                    " name='" + "radio" + "_" + options.colModel.name + "_" + options.rowId + "'" +
                    " value='" + this.value + "'" +
                    ((this.value == cellvalue) ? " checked=true" : "") + " disabled=true" +
                    " style='" + ((args.trans) ? "" : "margin: 0px 3px 1px 0px; vertical-align: -2px;") + "'" +
                    " />" +
                    "<span style='margin-top:0px;'>" + this.title + "</span>";
            });
            el = el + "</div>";

            return el + "<input type='hidden' value='" + cellvalue + "' />";
        };

        function formatSelect(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            if (cellvalue != "PM3/4" && $(cellvalue).length > 0) return cellvalue;
            var data = [];
            if (options.colModel.formatoptions.data.memory != undefined) {
                if (options.colModel.formatoptions.data.key != undefined) {
                    var filter = [];
                    $.each(options.colModel.formatoptions.data.key, function (i) {
                        if (rowObject.childNodes == undefined) {
                            var cell =
                                "<div>" +
                                $("#" + options.gid).getCell(options.rowId, options.colModel.formatoptions.data.key[i]) +
                                "</div>";
                            filter.push($(cell).find("input").val());
                        }
                        else {
                            var match = 0;
                            $.each(colmodel, function (j) {
                                if (this.name == options.colModel.formatoptions.data.key[i])
                                    match = j;
                            });
                            filter.push(rowObject.childNodes[match].text);
                        }
                    });
                    var param = {
                        name: options.colModel.formatoptions.data.memory,
                        key: filter
                    };
                    data = gw_com_module.selectGet(param);
                }
                else if (options.colModel.formatoptions.data.by != undefined) {
                    var filter = [];
                    $.each(options.colModel.formatoptions.data.by, function (i) {
                        if (this.source != undefined)
                            filter.push(gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid));
                        else {
                            if (rowObject.childNodes == undefined) {
                                var cell =
                                    "<div>" +
                                    $("#" + options.gid).getCell(options.rowId, this.key) +
                                    "</div>";
                                filter.push($(cell).find("input").val());
                            }
                            else {
                                var key = this.key;
                                var match = 0;
                                $.each(colmodel, function (j) {
                                    if (this.name == key)
                                        match = j;
                                });
                                filter.push(rowObject.childNodes[match].text);
                            }
                        }
                    });
                    var param = {
                        name: options.colModel.formatoptions.data.memory,
                        key: filter
                    };
                    data = gw_com_module.selectGet(param);
                }
                else {
                    var param = {
                        name: options.colModel.formatoptions.data.memory
                    };
                    data = gw_com_module.selectGet(param);
                }
            }
            else
                data = options.colModel.formatoptions.data;
            var title = "";
            for (var format_j = 0; format_j < data.length; format_j++) {
                if (cellvalue == data[format_j].value) {
                    title = data[format_j].title;
                    break;
                }
            }
            return title + "<input type='hidden' value='" + cellvalue + "' />";

        };

        function formatLink(cellvalue, options, rowObject) {

            if (cellvalue == undefined || cellvalue == null || cellvalue.toString().trim() == "" || cellvalue == "undefined")
                return "";
            var el =
                "<div" +
                ">" +
                "<a href='#'" +
                " style='color:blue; font-weight:normal;'";
            el = el +
                " onclick='" +
                "$(" + options.colModel.formatoptions.parent + "_data).setSelection(" + options.rowId + ");";
            var event = $.data($(targetobj + "_data")[0], "event");
            if (event[options.colModel.name + "_click"] != undefined) {
                el = el +
                    "var param = {" +
                    "type: \"GRID\"," +
                    "object: \"" + options.colModel.formatoptions.parent + "\"," +
                    "row: " + options.rowId + "," +
                    "element: \"" + options.colModel.name + "\"" +
                    "};" +
                    "if (!" + event[options.colModel.name + "_click"] + "(param)) return false;"
            }
            el = el +
                "'" +
                ">" +
                ((options.colModel.formatoptions.value != undefined) ?
                    options.colModel.formatoptions.value : cellvalue) +
                "</a>";
            el = el +
                "</div>";
            return el;

        };

        function entryText(value, options) {

            if (options.bind == "create") {
                var row = (options.id.split("_"))[0];
                if (gw_com_api.getValue(options.parent, row, "_CRUD", true) == "R") {
                    var el = document.createElement("div");
                    $(el).attr("bind", "create");
                    var content =
                        value +
                        "<input" +
                        " type='hidden'" +
                        " id='" + options.id + "'" +
                        " name='" + options.name + "'" +
                        " value='" + value + "'" +
                        ((options.mask != undefined) ? "mask='" + options.mask + "'" : "") +
                        ((options.display != undefined) ? "display='" + options.display + "'" : "") +
                        " />";
                    $(el).html(content);
                    return el;
                }
            }
            var el = document.createElement("input");
            $(el).attr('type', 'text');
            $(el).attr('id', options.id);
            $(el).attr('name', options.name);
            $(el).attr('value', value);
            if (options.maxlength != undefined)
                $(el).attr('maxlength', options.maxlength);
            if (options.title != undefined)
                $(el).attr('title', options.title);
            if (options.style != undefined)
                $(el).attr('class', options.style);
            if (options.width != undefined)
                $(el).css('width', (options.width - 10) + 'px');
            if (options.mask != undefined) {
                var param = {
                    targetobj: el,
                    mask: options.mask,
                    readonly: (options.mask == "search" && options.readonly != false) ? true : false,
                    format: "icon"
                };
                gw_com_module.textMask(param);
            }
            if (options.display)
                $(el).attr("display", true);
            if (options.readonly)
                $(el).attr("readonly", true);
            if (options.disable)
                $(el).attr("disabled", true);
            options.prev = value;
            $(el).change(function () {
                var row = (this.id.split("_"))[0];
                var crud = $(targetobj + "_data")
                    .jqGrid('getCell', row, "_CRUD");
                $(targetobj + "_data")
                    .jqGrid('setCell', row, "_CRUD", (crud == "R") ? "U" : (crud == "I") ? "C" : crud);
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemchanged != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: {
                            prev: options.prev,
                            current: this.value
                        }
                    };
                    if (!event.itemchanged(param))
                        return true;
                }
                options.prev = this.value;
                return true;
            });
            $(el).dblclick(function () {
                var row = (this.id.split("_"))[0];
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemdblclick != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: this.value
                    };
                    event.itemdblclick(param);
                    return false;
                }
            });
            $(el).keypress(function (e) {
                var row = (this.id.split("_"))[0];
                var event = $.data($(targetobj + "_data")[0], "event");
                if (e.which == 13
                    && event.itemkeyenter != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: this.value
                    };
                    event.itemkeyenter(param);
                    return false;
                }
                return true;
            });
            return el;

        };

        function entryCheck(value, options) {

            var el = document.createElement("div");
            $(el).html(value);
            var evalue = $(el).find(":input[type=hidden]").val();
            var el = document.createElement("div");
            var content =
                //"<div" +
                //" style='display:none;'" +
                //">" +
                "<input" +
                " type='checkbox'" +
                " id='" + options.id + "'" +
                " name='" + options.name + "'" +
                " value='" + ((evalue == options.value) ? options.value : options.offval) + "'" +
                " onval='" + options.value + "'" +
                " offval='" + options.offval + "'" +
                ((options.disable) ? " disabled=true" : "");
            if (evalue == options.value)
                content = content +
                    " checked=true";
            if (options.title != undefined)
                content = content +
                    " title='" + options.title + "'";
            if (options.style != undefined)
                content = content +
                    " class='" + options.style + "'";
            content = content +
                " style='margin:2px 3px 0px 0px; vertical-align:-2px;'" +
                " />";
            if (options.text != undefined)
                content = content +
                    "<span" +
                    " style='padding-left:2px;'>" +
                    options.text +
                    "</span>";
            //content = content +
            //	"</div>";
            $(el).html(content);
            options.prev = "";
            $(el).find("input").change(function () {
                this.value =
                    (this.checked) ? options.value : options.offval;
                var row = (this.id.split("_"))[0];
                var crud = $(targetobj + "_data")
                    .jqGrid('getCell', row, "_CRUD");
                $(targetobj + "_data")
                    .jqGrid('setCell', row, "_CRUD", (crud == "R") ? "U" : (crud == "I") ? "C" : crud);
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemchanged != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: {
                            prev: options.prev,
                            current: this.value
                        }
                    };
                    if (!event.itemchanged(param))
                        return true;
                }
                options.prev = this.value;
                return true;
            });
            return el;

        };

        function entrySelect(value, options) {

            if (options.bind == "create") {
                var row = (options.id.split("_"))[0];
                if (gw_com_api.getValue(options.parent, row, "_CRUD", true) == "R") {
                    var el = document.createElement("div");
                    $(el).attr("bind", "create");
                    var data = [];
                    if (options.data.memory != undefined) {
                        if (options.data.key != undefined) {
                            var filter = [];
                            $.each(options.data.key, function (j) {
                                var cell = $("#" + options.parent + "_data").getCell(row, options.data.key[j]);
                                filter.push($(cell).find("select :selected").val());
                            });
                            var param = {
                                name: options.data.memory,
                                key: filter
                            };
                            data = gw_com_module.selectGet(param);
                        }
                        else if (options.data.by != undefined) {
                            var filter = [];
                            $.each(options.data.by, function (j) {
                                if (this.source != undefined)
                                    filter.push(gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid));
                                else {
                                    var cell = $("#" + options.parent + "_data").getCell(row, this.key);
                                    filter.push($(cell).find("select :selected").val());
                                }
                            });
                            var param = {
                                name: options.data.memory,
                                key: filter
                            };
                            data = gw_com_module.selectGet(param);
                        }
                        else {
                            var param = {
                                name: options.data.memory
                            };
                            data = gw_com_module.selectGet(param);
                        }
                    }
                    else
                        data = options.data;
                    var current = $("<div>" + value + "</div>").find("input").val();
                    var title = "";
                    for (var edit_j = 0; edit_j < data.length; edit_j++) {
                        if (current == data[edit_j].value) {
                            title = data[edit_j].title;
                            break;
                        }
                    }
                    var content =
                        title +
                        "<input" +
                        " type='hidden'" +
                        " id='" + options.id + "'" +
                        " name='" + options.name + "'" +
                        " value='" + ((current != undefined) ? current : ((value != undefined) ? value : "")) + "'" +
                        " />";
                    $(el).html(content);
                    return el;
                }
            }
            var el = document.createElement("select");
            $(el).attr('id', options.id);
            $(el).attr('name', options.name);
            //$(el).attr('size', options.size);
            var row = (options.id.split("_"))[0];
            var data = [];
            if (options.data.memory != undefined) {
                if (options.data.key != undefined) {
                    var filter = [];
                    $.each(options.data.key, function (j) {
                        var cell = $("#" + options.parent + "_data").getCell(row, options.data.key[j]);
                        filter.push($(cell).find("select :selected").val());
                    });
                    var param = {
                        name: options.data.memory,
                        key: filter
                    };
                    data = gw_com_module.selectGet(param);
                }
                else if (options.data.by != undefined) {
                    var filter = [];
                    $.each(options.data.by, function (j) {
                        if (this.source != undefined)
                            filter.push(gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid));
                        else {
                            var cell = $("#" + options.parent + "_data").getCell(row, this.key);
                            filter.push($(cell).find("select :selected").val());
                        }
                    });
                    var param = {
                        name: options.data.memory,
                        key: filter
                    };
                    data = gw_com_module.selectGet(param);
                }
                else {
                    var param = {
                        name: options.data.memory
                    };
                    data = gw_com_module.selectGet(param);
                }
            }
            else
                data = options.data;
            var current = $("<div>" + value + "</div>").find("input").val();
            if (options.data.unshift != undefined) {
                $.each(options.data.unshift, function (j) {
                    if ($.browser.msie)
                        $(el)[0].add(new Option(this.title, this.value));
                    else
                        $(el)[0].add(new Option(this.title, this.value), null);
                });
            }
            $.each(data, function (j) {
                if ($.browser.msie) {
                    $(el)[0].add(new Option(this.title, this.value));
                }
                else {
                    $(el)[0].add(new Option(this.title, this.value), null);
                }
            });
            if (options.data.push != undefined) {
                $.each(options.data.push, function (j) {
                    if ($.browser.msie)
                        $(el)[0].add(new Option(this.title, this.value));
                    else
                        $(el)[0].add(new Option(this.title, this.value), null);
                });
            }
            if (current != undefined)
                $(el).attr("value", current);
            else if (value != undefined)
                $(el).attr("value", value);
            else
                $(el).attr("value", "");
            if (options.readonly)
                $(el).attr("readonly", true);
            if (options.disable)
                $(el).attr("disabled", true);
            if (options.width != undefined)
                $(el).css('width', (options.width - 4) + 'px');
            options.prev = "";
            $(el).change(function () {
                if (options.change != undefined) {
                    $.each(options.change, function (i) {
                        var filter = [];
                        if (this.key != undefined) {
                            $.each(this.key, function (j) {
                                filter.push($(targetobj + "_form :input[id='" + row + "_" + this + "']").val());
                            });
                        }
                        else if (this.by != undefined) {
                            $.each(this.by, function (j) {
                                filter.push(
                                    (this.source != undefined)
                                        ? gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid)
                                        : $(targetobj + "_form :input[id='" + row + "_" + this.key + "']").val()
                                );
                            });
                        }
                        var param = {
                            name: this.memory,
                            key: filter
                        };
                        data = gw_com_module.selectGet(param);
                        var target = targetobj + "_form :input[id='" + row + "_" + this.name + "']";
                        $(target + " option").remove();
                        if (this.unshift != undefined) {
                            $.each(this.unshift, function (j) {
                                if ($.browser.msie)
                                    $(target)[0].add(new Option(this.title, this.value));
                                else
                                    $(target)[0].add(new Option(this.title, this.value), null);
                            });
                        }
                        $.each(data, function (j) {
                            if ($.browser.msie)
                                $(target)[0].add(new Option(this.title, this.value));
                            else
                                $(target)[0].add(new Option(this.title, this.value), null);
                        });
                        if (this.push != undefined) {
                            $.each(this.push, function (j) {
                                if ($.browser.msie)
                                    $(target)[0].add(new Option(this.title, this.value));
                                else
                                    $(target)[0].add(new Option(this.title, this.value), null);
                            });
                        }
                    });
                }
                var crud = $(targetobj + "_data")
                    .jqGrid('getCell', row, "_CRUD");
                $(targetobj + "_data")
                    .jqGrid('setCell', row, "_CRUD", (crud == "R") ? "U" : (crud == "I") ? "C" : crud);
                var event = $.data($(targetobj + "_data")[0], "event");
                if (event.itemchanged != undefined) {
                    var param = {
                        type: "GRID",
                        object: args.targetid,
                        row: row,
                        element: options.name,
                        value: {
                            prev: options.prev,
                            current: this.value
                        }
                    };
                    if (!event.itemchanged(param))
                        return true;
                }
                options.prev = this.value;
                return true;
            });
            return el;

        };

        function entryHidden(value, options) {

            var el = document.createElement("div");
            var content =
                value +
                "<input" +
                " type='hidden'" +
                " id='" + options.id + "'" +
                " name='" + options.name + "'" +
                " value='" + value + "'";
            if (options.display)
                content = content + " display=true";
            if (options.mask != undefined)
                content = content +
                    " mask='" + options.mask + "'";
            content = content +
                " />";
            $(el).html(content);
            return el;

        };

        function valueDefault(elem, operation, value) {

            if (operation == 'get') {
                return ($(elem).attr("bind") == "create")
                    //? $(elem).text() : $(elem).val();
                    ? $($(elem).find("input")).val() : $(elem).val();
            } else if (operation == 'set') {
                if ($(elem).attr("bind") == "create") {
                    //$(elem).text(value);
                    $($(elem).find("input")).val(value);
                }
                else
                    $(elem).val(value);
            }

        };

        function valueCheck(elem, operation, value) {

            var el = $(elem).find("input");
            if (operation == 'get') {
                if ($(el).attr("checked"))
                    return $(el).attr("value");
                else
                    return $(el).attr("offval");
            } else if (operation == 'set') {
                if (value == $(el).attr("value"))
                    $(el).attr("checked", true);
                else
                    $(el).attr("checked", false);
            }

        };

        function valueHidden(elem, operation, value) {

            if (operation == 'get') {
                return $(elem).text();
            } else if (operation == 'set') {
                $(elem).text(value);
                $($(elem).find("input")).val(value);
            }

        };

    },

    // validate. (grid)
    gridValidate: function (args) {

        var targetobj = "#" + args.targetid + "_form";
        return $(targetobj).valid();

    },

    gridSetLabel: function (args) {
        var targetobj = "#" + args.obj + "_data";
        $(targetobj).jqGrid('setLabel', args.col, args.label);

    },

    // retrieve. (grid)
    gridRetrieve: function (args) {

        $("#" + args.targetid).block();
        if (args.source != undefined && args.source.block)
            $("#" + args.source.id).block();

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }
        var targetobj = "#" + args.targetid + "_data";
        //$(targetobj).clearGridData();

        var url = (args.url != undefined)
            ? args.url : "../Service/svc_Retrieve_XML.aspx";
        var params =
            "?QRY_ID=" +
            ((args.query != undefined) ? args.query : $(targetobj).attr("query")) +
            "&QRY_COLS=" +
            this.v_Object[args.targetid].column +
            "&CRUD=" +
            ((args.crud == "insert") ? "C"
                : (args.crud == "update") ? "U" : "R") +
            "&OPTION=" +
            ((args.option != undefined) ? args.option : "NONE");
        if (args.key != undefined && args.key.length > 0) {
            var cols = "", vals = "";
            $.each(args.key, function (key_i) {
                cols = cols + ((key_i > 0) ? "," : "") + this.NAME;
                vals = vals + ((key_i > 0) ? "," : "") + this.VALUE;
            });
            params = params +
                "&KEY_COL=" + cols +
                "&KEY_VAL=" + vals;
        }
        if (args.source != undefined) {
            switch (args.source.type) {
                case "FORM":
                    {
                        var param = {
                            targetid: args.source.id
                        };
                        params = params + this.formtoARG(param);
                    }
                    break;
            }
            if (args.source.toggle)
                $("#" + args.source.id).toggle();
        }
        else if (args.params != undefined) {
            params = params + args.params;
        }

        if (args.header != undefined) {
            $.each(args.header, function () {
                $(targetobj).jqGrid('setLabel', this.name, this.label);
            });
        }
        $(targetobj)
            .jqGrid('setGridParam', {
                url: url + params,
                datatype: "xml",
                gridComplete: function () {
                    completeProcess();
                },
                loadComplete: function (response) {

                    var ids = gw_com_api.getRowIDs(args.targetid);
                    var model = $(targetobj).getGridParam('colModel');
                    $.each(model, function (i) {
                        var column = this.name;
                        if (gw_com_module.v_Object[args.targetid].option[column] == undefined
                            || gw_com_module.v_Object[args.targetid].option[column].summary == undefined) return true;
                        var summary = gw_com_module.v_Object[args.targetid].option[column].summary;
                        //var val = $(targetobj).jqGrid('getCol', this.name, false, summary.type);
                        var footer = {};
                        if (summary.type != undefined) {
                            var cnt = 0;
                            var sum = 0;
                            var val = 0;
                            $.each(ids, function () {
                                cnt += 1;
                                sum += Number(gw_com_api.getValue(args.targetid, this, column, true));
                            });
                            switch (summary.type) {
                                case "avg":
                                    {
                                        val = sum / cnt;
                                    }
                                    break;
                                default:
                                    {
                                        val = sum;
                                    }
                            }
                            footer[column] = val;
                            $(targetobj).jqGrid("footerData", "set", footer);
                        } else if (summary.title != undefined) {
                            footer[column] = summary.title;
                            $(targetobj).jqGrid("footerData", "set", footer);
                        }
                    });

                    successRequest(response);
                },
                loadError: function (xmlRequest, status, error) {
                    alert(
                        xmlRequest.status + '\r\n' + xmlRequest.statusText + '\r\n' + xmlRequest.responseText);
                    errorRequest();
                }
            })
            .trigger("reloadGrid");

        function completeProcess() {

            if (args.processed)
                return;

            if (args.handler_processed != undefined)
                args.handler_processed();

        };

        function successRequest(response) {

            if (args.processed)
                return;

            var editable = $.data($(targetobj)[0], "editable");
            if ((editable != undefined && editable.bind == "open")
                || args.crud == "insert" || args.crud == "update") {
                var ids = $(targetobj).getDataIDs();
                $.each(ids, function () {
                    var param = {
                        targetid: args.targetid,
                        row: this,
                        edit: true
                    };
                    gw_com_module.gridEdit(param);
                });
            }

            if ($("#" + args.targetid).attr("sheet")) {
                $("#" + args.targetid).attr("row", "");
                $("#" + args.targetid).attr("cell", "");
            }
            gw_com_module.v_Object[args.targetid].buffer.insert = null;
            gw_com_module.v_Object[args.targetid].buffer.insert = [];
            gw_com_module.v_Object[args.targetid].buffer.remove = null;
            gw_com_module.v_Object[args.targetid].buffer.remove = [];

            $("#" + args.targetid).unblock();
            if (args.source != undefined && args.source.block)
                $("#" + args.source.id).unblock();

            var user = $(targetobj).getGridParam('userData');
            if (args.select != undefined && args.select != false) {
                if (args.select == true)
                    $(targetobj).setSelection(user.select);
                else
                    $(targetobj).setSelection(args.select);
            }

            if (args.focus)
                $(targetobj).focus();

            if (gw_com_module.v_Current.loaded)
                gw_com_module.informSize();

            if (args.handler_success != undefined)
                args.handler_success(response.tData);
            else if (args.handler != undefined
                && args.handler.success != undefined)
                args.handler.success(response.tData, args.handler.param);

            args.processed = true;

        };

        function invalidRequest() {

            $("#" + args.targetid).unblock();
            if (args.source != undefined && args.source.block)
                $("#" + args.source.id).unblock();

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            $("#" + args.targetid).unblock();
            if (args.source != undefined && args.source.block)
                $("#" + args.source.id).unblock();

            if (args.handler_error != undefined)
                args.handler_error();

        };

    },

    // download. (grid)
    gridDownload: function (args) {

        //if (gw_com_api.getRowCount(args.targetid) < 1) return;
        var targetobj = "#" + args.targetid + "_data";
        var url = (args.url != undefined)
            ? args.url : "../Service/svc_Retrieve_EXCEL.aspx";
        var argument = $.data($("#" + args.targetid)[0], "argument");
        var remark = $.data($("#" + args.targetid)[0], "remark");

        var argument = $.data($("#" + args.targetid)[0], "argument");
        var data = {
            TITLE: encodeURIComponent($("#" + args.targetid).attr("title")),
            QRY_ID: encodeURIComponent(((args.query != undefined) ? args.query : $(targetobj).attr("query"))),
            //QRY_HDRS: encodeURIComponent(((args.header == false) ? "" : this.v_Object[args.targetid].header)),
            //QRY_COLS: this.v_Object[args.targetid].view,
            OPTION: encodeURIComponent(((args.option != undefined) ? args.option : "NONE")),
            QRY_OBJ: JSON.stringify(this.v_Object[args.targetid])
        };

        if (argument != undefined) {
            for (var i = 0; i < argument.split("&").length; i++) {
                var n = argument.split("&")[i].split("=")[0];
                var v = argument.split("&")[i].split("=")[1];
                if (n == "") continue;
                data[n] = v;
            }
        }

        var F = $(document.createElement("form")).attr({ "method": "POST", "action": url }).hide().appendTo("body");
        $.each(data, function (n, v) {
            $(document.createElement("textarea")).attr({ "name": n, "value": v }).appendTo(F);
        });

        if (remark != undefined) {
            $(document.createElement("textarea")).attr({ "name": "QRY_RMK", "value": remark }).appendTo(F);
        }
        $.blockUI();
        F.submit().remove();
        $.unblockUI();

    },

    // which selected. (grid)
    gridisSelected: function (args) {

        var targetobj = "#" + args.targetid + "_data";
        return (args.row == $(targetobj).jqGrid('getGridParam', 'selrow'));

    },

    // edit. (grid)
    gridEdit: function (args) {

        var targetobj = "#" + args.targetid + "_data";
        var row = (args.row == "selected")
            ? $(targetobj).jqGrid('getGridParam', 'selrow') : args.row;
        if (row == null) return;
        if (args.edit) {
            if (gw_com_module.v_Object[args.targetid].datepicker != undefined)
                $(targetobj).jqGrid('editRow', row, false, editDate);
            else
                $(targetobj).jqGrid('editRow', row, false);

            /*
            var focus = ($.data($(targetobj)[0], "editable")).focus;
            if (focus != undefined) {
            if (typeof(focus) == "object")
            focus = (args.insert) ? focus.create: focus.update;
            var el = "#" + args.targetid + "_form :input[id='" + row + "_" + focus + "']";
            ($(el).attr("type") == "text" || $(el).attr("type") == "textarea")
            ? $(el).select() : $(el).focus();
            }
            */
        }
        else {
            $(targetobj).jqGrid('saveRow', row, null, 'clientArray');
        }

        function editDate(row) {

            $.each(gw_com_module.v_Object[args.targetid].datepicker, function () {
                var el = "#" + row + "_" + this;
                if ($(el).attr("bind") != "create") {
                    var param = {
                        targetobj: "#" + row + "_" + this,
                        datepicker: true
                    };
                    gw_com_module.textMask(param);
                }
            });

        };

    },

    // insert. (grid)
    gridInsert: function (args) {

        $("#" + args.targetid).block();

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }

        var targetobj = "#" + args.targetid + "_data";
        var row = $(targetobj).getGridParam('reccount') + 1;
        if (args.record != true) {
            var ids = $(targetobj).getDataIDs();
            row = (ids.length <= 0) ? 1 : parseInt(ids[ids.length - 1]) + 1;
        }
        var datarow = {};
        if (args.value != undefined)
            datarow = args.value;
        datarow._CRUD = (args.updatable) ? "C" : "I";
        if (row == 1)
            datarow["_NO"] = row;
        else
            datarow["_NO"] = parseInt(gw_com_api.getCellValue("GRID", args.targetid, row - 1, "_NO")) + 1;
        if (args.data != undefined) {
            $.each(args.data, function (i) {
                switch (this.rule) {
                    case "INCREMENT":
                        {
                            if (row == 1)
                                if (this.start == undefined)
                                    datarow[this.name] = this.value;
                                else
                                    datarow[this.name] = this.start;
                            else {
                                var prev = gw_com_api.getCellValue("GRID", args.targetid, row - 1, this.name);
                                if (this.start != undefined && prev < this.start) prev = parseInt(this.start, 10) - 1;
                                datarow[this.name] =
                                    gw_com_api.prefixNumber(parseInt(prev, 10) + 1, prev.length);
                            }
                        }
                        break;
                    case "COPY":
                        {
                            if (this.row == "prev") {
                                if (row == 1)
                                    datarow[this.name] = (this.value != undefined) ? this.value : "";
                                else {
                                    datarow[this.name] =
                                        gw_com_api.getValue(
                                            args.targetid,
                                            row - 1,
                                            (this.source != undefined) ? this.source : this.name,
                                            true);
                                }
                            }
                            else if (this.row != undefined)
                                datarow[this.name] =
                                    gw_com_api.getValue(
                                        args.targetid,
                                        this.row,
                                        (this.source != undefined) ? this.source : this.name,
                                        true);
                        }
                        break;
                    default:
                        {
                            datarow[this.name] = this.value;
                        }
                        break;
                }
            });
        }
        if (!($(targetobj).jqGrid(
            'addRowData',
            row,
            datarow,
            (args.where != undefined && args.where.type != undefined) ? args.where.type : "last",
            (args.where != undefined && args.where.row != undefined) ? args.where.row : 0))) {
            gw_com_api.messageBox([
                { text: "데이터를 추가할 수 없습니다." }
            ]);
            $("#" + args.targetid).unblock();
            return -1;
        }
        if (args.focus)
            $(targetobj).setSelection(row, false);
        var current = gw_com_module.v_Object[args.targetid].current;
        gw_com_module.v_Object[args.targetid].current = null;
        if (current != null) {
            var crud = gw_com_api.getValue(args.targetid, current, "_CRUD", true);
            if (crud == "R") {
                var param = {
                    targetid: args.targetid,
                    row: current,
                    edit: false
                };
                gw_com_module.gridEdit(param);
            }
        }
        if (args.edit) {
            var param = {
                targetid: args.targetid,
                row: row,
                edit: true,
                insert: true
            };
            gw_com_module.gridEdit(param);
        }
        if (args.updatable)
            gw_com_module.v_Object[args.targetid].buffer.insert.push(row);

        $("#" + args.targetid).unblock();
        if (gw_com_module.v_Current.loaded)
            gw_com_module.informSize();
        return row;

    },

    // inserts. (grid)
    gridInserts: function (args) {

        $("#" + args.targetid).block();

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }

        var targetobj = "#" + args.targetid + "_data";
        var rownum = $(targetobj).getGridParam('reccount') + 1;
        if (args.record != true) {
            var ids = $(targetobj).getDataIDs();
            rownum = (ids.length <= 0) ? 1 : parseInt(ids[ids.length - 1]) + 1;
        }
        if (args.data != undefined) {
            $.each(args.data, function (i) {
                this["_CRUD"] = (args.updatable) ? "C" : "I";
                this["_NO"] = rownum + i;

                if (!($(targetobj).jqGrid(
                    'addRowData',
                    rownum + i,
                    this,
                    (args.where != undefined && args.where.type != undefined) ? args.where.type : "last",
                    (args.where != undefined && args.where.row != undefined) ? args.where.row : 0))) {
                    gw_com_api.messageBox([
                        { text: "데이터를 추가할 수 없습니다." }
                    ]);
                    $("#" + args.targetid).unblock();
                    return -1;
                }
                if (args.edit) {
                    var param = {
                        targetid: args.targetid,
                        row: this._NO,
                        edit: true,
                        insert: true
                    };
                    gw_com_module.gridEdit(param);
                }

                if (args.updatable) {
                    gw_com_module.v_Object[args.targetid].buffer.insert.push(this._NO);
                }
            });

            rownum += args.data.length - 1;

            if (args.focus)
                $(targetobj).setSelection(rownum, false);
            gw_com_module.v_Object[args.targetid].current = null;
        }


        $("#" + args.targetid).unblock();
        if (gw_com_module.v_Current.loaded)
            gw_com_module.informSize();
        return rownum;

    },

    // delete. (grid)
    gridDelete: function (args) {

        var targetobj = "#" + args.targetid + "_data";
        var row = (args.row == "selected")
            ? $(targetobj).jqGrid('getGridParam', 'selrow') : args.row;
        if (row == null) {
            gw_com_api.messageBox([
                { text: "삭제할 데이터가 선택되지 않았습니다." }
            ]);
            return false;
        }
        if (args.check != undefined
            && gw_com_api.getValue(args.targetid, row, args.check, true) != '1') {
            gw_com_api.messageBox([
                { text: "선택하신 데이터는 삭제할 권한이 없습니다." }
            ]);
            return false;
        }

        $("#" + args.targetid).block();

        if ($("#" + args.targetid).attr("sheet")) {
            $("#" + args.targetid).attr("row", "");
            $("#" + args.targetid).attr("cell", "");
        }
        if ($.data($(targetobj)[0], "editable") != undefined) {
            var crud = gw_com_api.getCellValue("GRID", args.targetid, row, "_CRUD");
            if ((crud == "R" || crud == "U") && args.remove != true) {
                gw_com_api.setCellValue("GRID", args.targetid, row, "_CRUD", "D");
                var data = {
                    COLUMN: [],
                    VALUE: []
                };
                var model = $(targetobj).getGridParam('colModel');
                $.each(model, function (i) {
                    if (gw_com_module.v_Object[args.targetid].option[this.name] == undefined) return;
                    if (gw_com_module.v_Object[args.targetid].option[this.name].edit != false
                        && !gw_com_module.v_Object[args.targetid].option[this.name].display) {
                        data.COLUMN.push(encodeURIComponent(this.name));
                        data.VALUE.push(encodeURIComponent(
                            gw_com_api.unMask(
                                gw_com_api.getCellValue("GRID", args.targetid, row, this.name),
                                gw_com_module.v_Object[args.targetid].option[this.name].mask
                            )
                        ));
                    }
                });
                gw_com_module.v_Object[args.targetid].buffer.remove.push(data);
            }
            else if (crud == "C") {
                $.each(gw_com_module.v_Object[args.targetid].buffer.insert, function (i) {
                    if (this == row)
                        gw_com_module.v_Object[args.targetid].buffer.insert.splice(i, 1);
                });
            }
        }
        /*
        for (i = parseInt(row) + 1; i <= $(targetobj).getGridParam('reccount') + 1; i++) {
        gw_com_api.setCellValue("GRID", args.targetid, i, "_NO", i - 1);
        }
        */
        $(targetobj).jqGrid('delRowData', row);
        gw_com_module.v_Object[args.targetid].current = null;
        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }

        $("#" + args.targetid).unblock();

        if (args.select) {
            var select = parseInt(row) + 1;
            if ($(targetobj).getCell(select, "_NO") != false)
                $(targetobj).setSelection(select);
            else {
                for (var i = parseInt(row) - 1; i >= 0; i--) {
                    if ($(targetobj).getCell(i, "_NO") != false) {
                        $(targetobj).setSelection(i);
                        break;
                    }
                }
            }
        }
        else
            $(targetobj).resetSelection();

        if (gw_com_module.v_Current.loaded)
            gw_com_module.informSize();
        return true;

    },

    // restore. (grid)
    gridRestore: function (args) {

        $("#" + args.targetid).block();

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }

        var targetobj = "#" + args.targetid + "_data";
        var row = (args.row == "selected")
            ? $(targetobj).jqGrid('getGridParam', 'selrow') : args.row;
        if (row == null) return false;
        $(targetobj).jqGrid('restoreRow', row);

        $("#" + args.targetid).unblock();

    },

    // insert. (grid)
    gridSearch: function (args) {

        var targetobj = "#" + args.targetid + "_data";
        var ids = $(targetobj).getDataIDs();
        for (var search_i = 0; search_i < ids.length; search_i++) {
            var row = $(targetobj).jqGrid('getRowData', ids[search_i]);
            var search = true;
            for (var search_j = 0; search_j < args.element.length; search_j++) {
                var value = gw_com_api.getValue(args.targetid, ids[search_i], args.element[search_j].name, true);
                if (value != args.element[search_j].value) {
                    search = false;
                    break;
                }
            }
            if (search) {
                $(targetobj).setSelection(ids[search_i]);
                break;
            }
        };

    },

    // copy. (grid)
    gridCopy: function (args) {

        var sourceobj = "#" + args.sourceid + "_data";
        var targetobj = "#" + args.targetid + "_data";
        var from = [];
        if (args.multi)
            from = $(sourceobj).jqGrid('getGridParam', 'selarrrow');
        else
            from.push($(sourceobj).jqGrid('getGridParam', 'selrow'));
        var to = $(targetobj).jqGrid('getGridParam', 'selrow');
        var data = {};
        $(from).each(function (i) {
            data = $(sourceobj).jqGrid('getRowData', from[i]);
            var param = {
                targetid: args.targetid,
                value: data
            };
            if (to != null) {
                var where = {
                    type: "after",
                    row: to
                };
                param.where = where;
            }
            gw_com_module.gridInsert(param);
            if (args.move) {
                var param = {
                    targetid: args.targetid,
                    row: this
                };
                gw_com_module.gridInsert(param);
            }
        });

    },

    // clear. (grid)
    gridClear: function (args) {

        $("#" + args.targetid).block();

        var targetobj = "#" + args.targetid + "_data";
        $(targetobj).clearGridData();
        if ($("#" + args.targetid).attr("sheet")) {
            $("#" + args.targetid).attr("row", "");
            $("#" + args.targetid).attr("cell", "");
        }
        gw_com_module.v_Object[args.targetid].buffer.insert = null;
        gw_com_module.v_Object[args.targetid].buffer.insert = [];
        gw_com_module.v_Object[args.targetid].buffer.remove = null;
        gw_com_module.v_Object[args.targetid].buffer.remove = [];

        $("#" + args.targetid).unblock();

    },

    // event handler. (grid)
    gridEvent: function (args) {

        var targetobj = "#" + args.targetid + "_data";
        switch (args.name) {
            case "beforeSelectRow":
                {
                    var editable = $.data($(targetobj)[0], "editable");
                    if (editable == undefined
                        || (editable != undefined
                            && (editable.master || editable.bind == "open" || editable.bind == "get"))) {
                        if (args.row == $(targetobj).jqGrid('getGridParam', 'selrow'))
                            return false;
                    }
                }
                break;
            case "onSelectRow":
                {
                    var current = gw_com_module.v_Object[args.targetid].current;
                    gw_com_module.v_Object[args.targetid].current = args.row;
                    var editable = $.data($(targetobj)[0], "editable");
                    if (editable != undefined) {
                        if (editable.bind == "select") {
                            if (current != null && current != args.row) {
                                var crud = gw_com_api.getValue(args.targetid, current, "_CRUD", true);
                                if (crud == "R") {
                                    var param = {
                                        targetid: args.targetid,
                                        row: current,
                                        edit: false
                                    };
                                    gw_com_module.gridEdit(param);
                                }
                            }
                            var crud = gw_com_api.getValue(args.targetid, args.row, "_CRUD", true);
                            if (crud == "R") {
                                var param = {
                                    targetid: args.targetid,
                                    row: args.row,
                                    edit: args.status
                                };
                                gw_com_module.gridEdit(param);
                                if (!args.status)
                                    $(targetobj).resetSelection();
                            }
                        }
                        else if (editable.bind != undefined && editable.bind != "open" && editable.bind != "get") {
                            if (current != null && current != args.row) {
                                var crud = gw_com_api.getValue(args.targetid, current, "_CRUD", true);
                                if (crud == "R") {
                                    var param = {
                                        targetid: args.targetid,
                                        row: current,
                                        edit: false
                                    };
                                    gw_com_module.gridEdit(param);
                                }
                            }
                            var edit = gw_com_api.getValue(args.targetid, args.row, editable.bind, true);
                            var crud = gw_com_api.getValue(args.targetid, args.row, "_CRUD", true);
                            if (edit == "1" && crud == "R") {
                                var param = {
                                    targetid: args.targetid,
                                    row: args.row,
                                    edit: args.status
                                };
                                gw_com_module.gridEdit(param);
                                if (!args.status)
                                    $(targetobj).resetSelection();
                            }
                        }
                    }
                }
                break;
            case "onCellSelect":
                {
                    var editable = $.data($(targetobj)[0], "editable");
                    if (editable != undefined) {
                        if (editable.bind == "select") {
                            var crud = gw_com_api.getValue(args.targetid, args.row, "_CRUD", true);
                            if (crud == "R") {
                                //alert(args.row + "-" + args.col);
                            }
                        }
                    }
                }
                break;
        }
        return true;

    },

    // create. (chart)
    chartCreate: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).attr("name", args.targetid);
        if (args.query != undefined)
            $(targetobj).attr("query", args.query);
        if (args.caption) {
            var content =
                "<div id='" + args.targetid + "_wrap' style='width:100%; margin:0; padding:0;'>" +
                "<div align='left' style='margin-bottom:2px;' class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'>" +
                "<div class='ui-jqgrid-titlebar ui-widget-header ui-corner-top'>" +
                "<span id='" + args.targetid + "_caption' class='ui-jqgrid-title'>" +
                "◈ " + args.title +
                "</span>" +
                "</div>" +
                "</div>" +
                "</div>";
            $(targetobj).prepend(content);
        }
        if (args.show != true)
            $(targetobj).hide();
        var format = (args.format != undefined) ? args.format : { view: "0", rotate: "0", reverse: "0", series: false };
        $.data($(targetobj)[0], "format", format);

        if (args.control != undefined) {
            switch (args.control.by) {
                case "DX": {
                    args.control.id.SetVisible(true);
                } break;
            }
            $.data($(targetobj)[0], "control", args.control);
        }

        if (args.handler != undefined) {
            var charthandler = args.handler;
            $(targetobj).bind(charthandler.event, function () {
                var uiparam = { type: "CHART", object: args.targetid, row: 1, element: charthandler.event };
                return charthandler.action(uiparam);
            });
        }
        else {
            $(targetobj).dblclick(function () {
                var url =
                    "../job/" + ((format.series) ? "DLG_CHARTS.aspx" : "DLG_CHART.aspx") +
                    "?title=" + ((args.title != undefined) ? args.title : "통계 차트") +
                    "&view=" + format.view +
                    "&rotate=" + format.rotate +
                    "&reverse=" + format.reverse +
                    "&query=" + args.query +
                    "&remark=" + "테스트 조건입니다-" +
                    $.data($(targetobj)[0], "argument");
                window.open(url, "popup", "width=1280, height=760, left=0, top=0, toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, scrollbars=yes, copyhistory=no");
            });
        }

        if ($("#navControl").length > 0 && (args.menu == undefined ? true : args.menu)) {
            var content =
                "<li class='chart'><a href='#1'>Bar</a></li>" +
                "<li class='chart'><a href='#2'>Point</a></li>" +
                "<li class='chart'><a href='#3'>Line</a></li>" +
                "<li class='chart'><a href='#4'>Spline</a></li>" +
                "<li class='chart'><a href='#5'>Area</a></li>" +
                ((format.series) ? "" : "<li class='chart'><a href='#6'>Pie</a></li>") +
                ((format.series) ? "" : "<li class='chart'><a href='#7'>Doughnut</a></li>") +
                "<li class='chart'><a href='#9'>Stacked Bar</a></li>" +
                "<li class='chart'><a href='#10'>Side by Side Full Stacked Bar</a></li>" +
                "<li class='chart'><a href='#R'>Rotate</a></li>" +
                "<li class='chart'><a href='#V'>Reverse</a></li>";
            $("#navControl").html(content);
            $("#" + args.targetid).contextMenu(
                { menu: 'navControl' },
                function (action, el, pos) {
                    var param = {
                        targetid: args.targetid,
                        params: "&ACT=retrieve" + $.data($(targetobj)[0], "argument"),
                        query: args.query,
                        format: {}
                    };
                    if (action == "R")
                        param.format.rotate = true;
                    else if (action == "V")
                        param.format.reverse = true;
                    else
                        param.format.view = action;
                    gw_com_module.chartRetrieve(param);
                }
            );
        }

    },

    // retrieve. (chart)
    chartRetrieve: function (args) {

        var targetobj = "#" + args.targetid;
        var format = $.data($(targetobj)[0], "format");
        format.view = (args.format.view != undefined) ? args.format.view : format.view;
        format.rotate = (args.format.rotate) ? ((format.rotate == "1") ? "0" : "1") : format.rotate;
        format.reverse = (args.format.reverse) ? ((format.reverse == "1") ? "0" : "1") : format.reverse;
        $.data($(targetobj)[0], "format", format);
        var params =
            "T=" + format.view +
            "&R=" + format.rotate +
            "&V=" + format.reverse +
            "&QRY_ID=" +
            ((args.query != undefined) ? args.query : $(targetobj).attr("query")) +
            args.params;
        var control = $.data($(targetobj)[0], "control");
        if (control != undefined) {
            switch (control.by) {
                case "DX":
                    {
                        control.id.PerformCallback(params);	// OnCustomCallback 서버 함수를 호출한다
                    }
                    break;
            }
        }

    },

    // refresh. (chart)
    chartRefresh: function (args) {

        var targetobj = "#" + args.targetid;
        var format = $.data($(targetobj)[0], "format");
        var params =
            "T=" + format.view +
            "&R=" + format.rotate +
            "&V=" + format.reverse +
            "&QRY_ID=" +
            ((args.query != undefined) ? args.query : $(targetobj).attr("query")) +
            "&ACT=retrieve" + $.data($(targetobj)[0], "argument");
        var control = $.data($(targetobj)[0], "control");
        if (control != undefined) {
            switch (control.by) {
                case "DX":
                    {
                        control.id.PerformCallback(params);
                    }
                    break;
            }
        }

    },

    // create. (export)
    exportCreate: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).attr("name", args.targetid);
        switch (args.type) {
            case "PAGE":
                {
                    var content =
                        "<iframe id='" + args.targetid + "_page'" +
                        " name='" + args.targetid + "_page'" +
                        " src='" + ((args.value != undefined) ? args.value : "") + "'" +
                        " width='" + ((args.width != undefined) ? args.width + "px'" : "100%'") +
                        " height='" + ((args.height != undefined) ? args.height : "500") + "px'" +
                        " marginheight=0 marginwidth=0" +
                        " style='" + ((args.show) ? "" : "display:none;") + "'" +
                        ">" +
                        "</iframe>";
                    $(targetobj).html(content);
                }
                break;
            case "FILE":
                {
                    var content =
                        "<iframe id = '" + args.targetid + "_file'" +
                        " name='" + args.targetid + "_file'" +
                        " src='' width=0 height=0 marginheight=0 marginwidth=0" +
                        " style='display:hidden;'" +
                        ">" +
                        "</iframe>";
                    $(targetobj).html(content);
                }
                break;
            case "POPUP":
                {
                    content =
                        "<iframe id='" + args.name + "_page'" +
                        " name='" + args.name + "_page'" +
                        " src='" + ((args.value != undefined) ? args.value : "") + "'" +
                        " width='100%'" +
                        " height='100%'" +
                        " frameborder='no' scrolling='no' marginheight=0 marginwidth=0" +
                        ">" +
                        "</iframe>";
                    var $dynamic =
                        $("<div id='lyrExport_" + args.name + "'></div>")
                            .html(content)
                            .dialog({
                                autoOpen: false,
                                title: "◈ " + args.title,
                                disabled: true,
                                draggable: false,
                                position: ['center'],
                                closeOnEscape: true,
                                closeText: "Exit",
                                modal: true,
                                resizable: false,
                                dialogClass: "dialog_window",
                                width: args.width,
                                height: args.height
                            });
                    $dynamic.dialog();
                }
                break;
            case "WINDOW":
                {
                    /*
                    var content =
                    "<a" +
                    " id='" + args.targetid + "_window'" +
                    " href='" + ((args.value != undefined) ? args.value : "") + "'" +
                    " title='" + ((args.title != undefined) ? args.title : "") + "'" +
                    //" style='width:0; height:0; display:hidden;'" +
                    ">" +
                    "</a>";
                    $(targetobj).html(content);
                    $(targetobj + "_window")
                    .popupWindow({
                    width: (args.width != undefined) ? args.width : 800,
                    height: (args.height != undefined) ? args.height : 600,
                    centerBrowser: 1
                    });
                    */
                }
                break;
        }

    },

    // create. (page)
    pageCreate: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).attr("name", args.targetid);
        var content =
            "<iframe id='" + args.targetid + "_page'" +
            " name='" + args.targetid + "_page'" +
            " src='" + ((args.source != undefined) ? args.source : "") + "'" +
            " width='" + ((args.width != undefined) ? args.width + 'px' : '100%') + "'" +
            " height='" + ((args.height != undefined) ? args.height + 'px' : '500px') + "'" +
            " scrolling='no' marginheight='0' marginwidth='0'" +
            ">" +
            "</iframe>";
        var obj = $(targetobj).html(content);
        if ((args.height == undefined || args.height == 0) && (args.width == undefined || args.width == 0))
            $(obj).attr("style", "border:none; visibility: hidden;");

    },

    // retrieve. (page)
    pageRetrieve: function (args) {

        var targetobj = "#" + args.targetid;
        $(targetobj).block();

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }

        var url = (args.url != undefined)
            ? args.url : this.v_Current.window + ".aspx/Export";
        var params = {
            DATA: {
                QUERY: (args.query != undefined) ? args.query : $(targetobj + "_page").attr("query"),
                ARGUMENT: args.params.ARGUMENT,
                VALUE: args.params.VALUE
            }
        };
        if (args.option) {
            params.DATA.OPTION = [];
            params.DATA.OPTIONVALUE = [];
            $.each(args.option, function (i) {
                params.DATA.OPTION.push(this.name);
                params.DATA.OPTIONVALUE.push(this.value);
            });
        }

        var param = {
            request: "SERVICE",
            url: url,
            params: JSON.stringify(params),
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            if (args.handler_success != undefined)
                args.handler_success(response.tData);

            if (args.show)
                $(targetobj + "_page").attr("src", "../Report/" + gw_com_module.v_Current.window + "/" + response);
            if (args.save) {
                var params = "?RPT_ID=" + encodeURIComponent(gw_com_module.v_Current.window + "/" + response);
                $(targetobj + "_page").attr("src", "../Service/svc_Download.aspx" + params);
            }

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();

        };

        function completeRequest() {

            $(targetobj).unblock();

            if (args.handler_complete != undefined)
                args.handler_complete();

        };

    },

    // open. (page)
    pageOpen: function (args) {

        var params = "";
        if (args.param != undefined)
            params = this.toParam(args.param);

        if (args.target.type == "TAB") {
            var param = {
                tabid: args.target.id,
                name: args.target.name,
                index: args.target.index
            };
            if (!this.checkTab(param)) {
                this.closeTab(param);
            }
        }
        switch (args.target.type) {
            case "PAGE":
                {
                    var targetobj = "#" + args.target.id + "_page";
                    $(targetobj).attr("src", args.page + params);
                    $(targetobj).show();
                }
                break;
            case "POPUP":
                {
                    $("#" + args.target.id + "_page").attr("src", args.page + params);
                    $("#lyrDlg_" + args.target.name).dialog('open');
                }
                break;
            case "TAB":
                {
                    var param = {
                        tabid: args.target.id,
                        name: args.target.name,
                        index: args.target.index,
                        content: args.page + params
                    };
                    gw_com_module.addTab(param);
                }
                break;
        }

    },

    // convert to tab.
    convertTab: function (args) {

        var option = {};
        if (args.collapsible)
            option.collapsible = true;
        option.collapsible = false;
        var content = "<ul>";
        $.each(args.target, function (i) {
            content = content +
                "<li>" +
                "<a" +
                " id='" + this.id + "_tab'" +
                " href='#" + this.id + "'" +
                " type='" + this.type + "'" +
                " target='" + this.id + "'" +
                ">" +
                this.title +
                "</a>" +
                "</li>";
        });
        content = content + "</ul>";
        var tabobj = "#" + args.tabid;
        $(tabobj).prepend(content);
        if (args.height != undefined)
            $(tabobj).css("height", args.height);
        $(tabobj).tabs(option);

        $.each(args.target, function (i) {
            if (this.disable)
                $(tabobj).tabs("disable", i);
        });

        $(tabobj + " span.ui-icon-close").live("click", function () {
            $(tabobj + "_" + $(this).attr("title")).remove();
            var index = $("li", tabobj).index($(this).parent());
            $(tabobj).tabs("remove", index);
        });

        if (this.v_Current.loaded)
            this.informSize();

    },

    // launch tab.
    launchTab: function (args) {

        // Set Languages : by JJJ at 2020.01
        gw_com_langs.setLangs("launchTab", args);

        var tabobj = "#" + args.tabid;
        var content = "";
        $.each(args.target, function () {
            content = content +
                "<div id='lyr_" + this.id + "'>" +
                "</div>";
        });
        $(tabobj).html(content);

        var option = {
            collapsible: (args.collapsible) ? true : false
        };
        var content = "<ul>";
        $.each(args.target, function () {
            content = content +
                "<li>" +
                "<a" +
                " id='tab_" + this.id + "'" +
                " href='#lyr_" + this.id + "'" +
                " target='lyr_" + this.id + "'" +
                " type='PAGE'" +
                " page='" + this.id + "'" +
                ">" +
                this.title +
                "</a>" +
                "</li>";
        });
        content = content + "</ul>";
        $(tabobj).prepend(content);
        if (args.height != undefined)
            $(tabobj).css("height", args.height);
        $(tabobj).tabs(option);

        $.each(args.target, function () {
            var index = this.id;
            var content =
                "<iframe id='page_" + index + "'" +
                " name='page_" + index + "'" +
                " src='../Job/" + index + ".aspx" +
                "?NAME=" + index +
                "&LAUNCH=CHILD&TYPE=MAIN&IFRAME=1" +
                "&PAGE=" + gw_com_module.v_Current.window +
                //"&MENU_ARGS=" + gw_com_module.v_Current.menu_args +
                ((gw_com_module.v_Current.menu_args.indexOf("=") < 1) ? "&MENU_ARGS=" + gw_com_module.v_Current.menu_args : "") +
                ((gw_com_module.v_Current.menu_args.indexOf("=") > 0) ? "&PARAM=true" + (gw_com_module.v_Current.menu_args.substring(0, 1) == "&" ? "" : "&") + gw_com_module.v_Current.menu_args : "") +
                "'" +
                " width='100%' height='550px' frameborder='yes' scrolling='no' marginheight=0 marginwidth=0" +
                "></iframe>";
            if (this.launch) {
                $("#lyr_" + index).html(content);
                gw_com_module.objLog({ obj_id: index, obj_title: this.title });
            }
            if (this.disable)
                $(tabobj).tabs("disable", i);
        });
        $(tabobj).bind("tabsselect", function (event, ui) {
            if ($("#" + ui.panel.id).html() == "") {
                var obj = args.target[ui.index];
                var index = obj.id;
                var content =
                    "<iframe id='page_" + index + "'" +
                    " name='page_" + index + "'" +
                    " src='../Job/" + index + ".aspx" +
                    "?NAME=" + index +
                    "&LAUNCH=CHILD&TYPE=MAIN&IFRAME=1" +
                    "&PAGE=" + gw_com_module.v_Current.window +
                    //"&MENU_ARGS=" + gw_com_module.v_Current.menu_args +
                    ((gw_com_module.v_Current.menu_args.indexOf("=") < 1) ? "&MENU_ARGS=" + gw_com_module.v_Current.menu_args : "") +
                    ((gw_com_module.v_Current.menu_args.indexOf("=") > 0) ? "&PARAM=true" + (gw_com_module.v_Current.menu_args.substring(0, 1) == "&" ? "" : "&") + gw_com_module.v_Current.menu_args : "") +
                    "'" +
                    " width='100%' height='550px' frameborder='yes' scrolling='no' marginheight=0 marginwidth=0" +
                    ">" +
                    "</iframe>";
                $("#" + ui.panel.id).html(content);
            }
        });
        $(tabobj + " span.ui-icon-close").live("click", function () {
            $(tabobj + "_" + $(this).attr("title")).remove();
            var index = $("li", tabobj).index($(this).parent());
            $(tabobj).tabs("remove", index);
        });

        $(tabobj).tabs({
            select: function (event, ui) {
                var obj = args.target[ui.index];
                gw_com_module.objLog({ obj_id: obj.id, obj_title: obj.title });
                if (obj.handler != undefined) obj.handler(ui);
            }
        });

        if (this.v_Current.loaded)
            this.informSize();

    },

    // load tab.
    loadTab: function (args) {

        var tabobj = "#" + args.tabid;
        var index = args.targetid;
        var content =
            "<iframe id='page_" + index + "'" + " name='page_" + index + "'" +
            " src='../Job/" + index + ".aspx" +
            "?NAME=" + index +
            "&LAUNCH=CHILD" + "&TYPE=MAIN" + "&IFRAME=1" +
            "&PAGE=" + gw_com_module.v_Current.window +
            "&MENU_ARGS=" + gw_com_module.v_Current.menu_args +
            ((args.param != undefined) ? "&PARAM=true" + args.param : "") +
            "'" +
            " width='100%'" +
            " height='550px'" +
            " frameborder='yes' scrolling='no' marginheight=0 marginwidth=0" +
            ">" +
            "</iframe>";
        $("#lyr_" + index).html(content);
        $(tabobj).tabs('select', index);

        if (this.v_Current.loaded)
            this.informSize();

    },

    // add to tab.
    addTab: function (args) {

        var tabobj = "#" + args.tabid;
        var title = args.name;
        title = (args.index != undefined) ? title + "-" + args.index : title;
        var index = "#" + args.tabid + "-" + title;
        if ($(index).html() != null) {
            $(tabobj).tabs('select', index);
        }
        else {
            var option = {
                tabTemplate: "<li><a href='#{href}'>#{label}</a> <span title='#{label}' style='mragin:0; margin-top:2px; cursor:pointer;' class='ui-icon ui-icon-close'>Remove Tab</span></li>",
                add: function (event, ui) {
                    var page = args.tabid + "_" + title;
                    var content =
                        "<iframe id='" + page + "'" + " name='" + page + "'" +
                        " src='" + args.content + "'" +
                        " width='100%'" +
                        " height='" + ((args.height != undefined) ? args.height : 450) + "px'" +
                        " frameborder='yes' marginheight=0 marginwidth=0" +
                        ">" +
                        "</iframe>";
                    $(ui.panel).append(content);
                }
            };
            $(tabobj).tabs("option", option);
            $(tabobj).tabs("add", index, title);
            $(tabobj).tabs('select', index);
        }

        if (this.v_Current.loaded)
            this.informSize();

    },

    // check tab.
    checkTab: function (args) {

        var tabobj = "#" + args.tabid;
        var title = args.name;
        title = (args.index != undefined) ? title + "-" + args.index : title;
        var index = "#" + args.tabid + "-" + title;
        if ($(index).html() != null) {
            $(tabobj).tabs('select', index);
            return false;
        }
        return true;

    },

    // close tab.
    closeTab: function (args) {

        var tabobj = "#" + args.tabid;
        var title = args.name;
        title = (args.index != undefined) ? title + "-" + args.index : title;
        var index = "#" + args.tabid + "-" + title;
        $(tabobj).tabs("remove", index);

    },

    // prepare dialogue window.
    dialogueOpenJJ: function (args) {

        //---------- check preOpened Dialogue
        if (args.open == undefined) args.open = true;
        var targetobj = "lyrDlg_" + ((args.type == "INLIKE") ? args.id : args.page);
        if ($("#" + targetobj).html() != null) {
            if (args.open) return openPopup(args.data); // Open
            else return false;  // Prepare
        }

        // 공통 Size 설정 : 파일업로드
        //if (args.page == "DLG_FileUpload") {
        //    args.width = 650;
        //    args.height = 380;
        //}

        // set Content for Dialogue Box or Page
        var content = "";
        if (args.type == "PAGE") {
            // object log
            this.objLog({ obj_id: args.page, obj_title: args.title });

            // set default value to args
            if (args.path == undefined) args.path = "../Job/";
            if (args.content == undefined) args.content = "aspx";
            if (args.pageArgs == undefined) args.pageArgs = "";

            // set Frame Attributes
            var srcUrl = args.path + args.page + "." + args.content;
            var srcArg = "?NAME=" + args.page + "&LAUNCH=POPUP" + "&TYPE=" + this.v_Current.launch +
                "&PAGE=" + this.v_Current.window + "&ARGS=" + args.pageArgs;
            var frmOpt = (args.scroll) ? "" : "scrolling='no'";

            // create contents of Frame
            content = "<iframe id='page_" + args.page + "'" + " name='page_" + args.page + "'" + " src='" + srcUrl + srcArg + "'" +
                " width='100%'  height='100%'  frameborder='no' marginheight=0 marginwidth=0 " + frmOpt +
                "></iframe>";
            this.v_Current.dialogue = args.page;
        }
        else if (args.type == "INLINE") {
            content = content + "<form id='" + args.id + "'  action=''>";
            content = content + "<table border = '0' style = 'margin:0; padding:0;'" +
                " width='" + ((args.width != undefined) ? args.width + "px" : "100%") + "' > ";
            content = content + "<tr>";
            $.each(args.element, function (i) {
                var eid = args.id + "_" + this.name;
                var evalue = (this.value != undefined) ? this.value : "";
                if (this.hidden) {
                    content = content +
                        "<input type='hidden' id='" + eid + "'" + " name='" + this.name + "'" + " value='" + evalue + "'" + " />";
                    return;
                }
                if (this.label != undefined) {
                    content = content +
                        "<td" + ((this.label.width != undefined) ? " width='" + this.label.width + "'" : "") + ">" +
                        "<div style='overflow:hidden;'>" +
                        "<label>" + this.label.title + "</label>" + "</div>" + "</td>";
                }
                etype = (this.editable != undefined) ? this.editable.type : "";
                switch (etype) {
                    case "text":
                        {
                            content = content +
                                "<td" + ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                " align='" + ((this.align != undefined) ? this.align : "left") + "'" + ">" +
                                "<div style='overflow:hidden;'>";
                            content = content +
                                "<input type='text'" +
                                " id='" + eid + "'" + " name='" + this.name + "'" + " value='" + evalue + "'" +
                                " size='" + this.editable.size + "'" + " maxlength='" + this.editable.maxlength + "'";
                            if (this.editable.validate != undefined) {
                                content = content +
                                    " class='{validate: { " + this.editable.validate.rule + " }}'" +
                                    " title='" + this.editable.validate.message + "'";
                            }
                            content = content + " />" + "</div>" + "</td>";
                        }
                        break;
                    case "label":
                        {
                            content = content +
                                "<td" + ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                " align='" + ((this.align != undefined) ? this.align : "left") + "'" + ">" +
                                "<div style='overflow:hidden;'>";
                            content = content +
                                "<span" + " id='" + eid + "'" + " name='" + this.name + "'" + ">" + evalue + "</span>"
                            content = content + "</div>" + "</td>";
                        }
                        break;
                }
            });
            content = content + "</tr>"
            if (args.button != undefined) {
                content = content + "<tr>" +
                    "<td" + " align='center'" + " valign='middle'" + ">";
                $.each(args.button, function (i) {
                    var eid = args.id + "_" + this.name;
                    var evalue = (this.value != undefined) ? this.value : "";
                    content = content +
                        "<button class='workButton' style='margin:0; margin-left:10px; padding:0;'" +
                        " type='button'" + " id='" + eid + "'" + " name='" + eid + "'" +
                        ">" +
                        "<span><span><span style='color: #4f4f4f;'>" +
                        "<div style='float:left;" +
                        ((evalue != "") ? "padding-top: 2px; padding-left:12px;" : "padding-top: 3px; padding-left:6px;") + "'>" +
                        "<img src='" +
                        gw_com_api.getResource("ICON", (this.icon != undefined) ? this.icon : this.name, "png") + "'" + " />" +
                        "</div>" +
                        "<div style='float:left; padding-top: 6px; font-family: 굴림체; font-size: 9pt; color: #4f4f4f;'>" +
                        ((evalue != "") ? "&nbsp;" + evalue + "&nbsp;&nbsp;" : "&nbsp;") +
                        "</div>" + "</span></span></span>" +
                        "</button>";
                });
                content = content + "</td></tr>"
            }
            content = content + "</table>" + "</form>";
        }

        // create Dialogue Element
        var $dynamic =
            $("<div id='" + targetobj + "' style='overflow:hidden'></div>")
                .html(content)
                .dialog({
                    autoOpen: false, closeOnEscape: false, disabled: true, draggable: true, modal: true,
                    title: "◈ " + args.title,
                    position: (args.locate != undefined) ? args.locate : ['center'],
                    open: function (event, ui) {
                        if (args.control != true) $(".ui-dialog-titlebar-close").hide();    // hide Control Box of Popup Window
                    },
                    closeText: "Exit",
                    resizable: args.resize ? args.resize : false,
                    dialogClass: "dialog_window", width: args.width, height: args.height
                });
        $dynamic.dialog();

        // check open Option
        if (args.open) {
            if (args.type == "PAGE")
                openPopup();  // 첫번째 Open의 경우 Page 객체 생성 이전에 실행되기 때문에 param 전달 안함. ready 에서 I/F 호출
            else $dynamic.dialog('open');

        }
        return true;

        // open Dialogue & call streamInterface
        function openPopup(param) {
            gw_com_module.v_Current.dialogue = args.page;
            $("#lyrDlg_" + args.page).dialog('open');

            // Page Popup의 경우 page I/F 호출
            if (args.type == "PAGE" && param != undefined) {
                var param2 = {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    to: { type: "POPUP", page: args.page },
                    data: param
                };
                gw_com_module.streamInterface(param2);
            }

            return true;
        };
    },

    dialoguePrepare: function (args) {

        var targetobj = "";
        var content = "";
        switch (args.type) {
            case "INLINE":
                {
                    targetobj = "lyrDlg_" + args.id;
                    if ($("#" + targetobj).html() != null)
                        return false;
                    content = content +
                        "<form" +
                        " id='" + args.id + "'" +
                        " action=''" +
                        ">";
                    content = content +
                        "<table" +
                        " width='" + ((args.width != undefined) ? args.width + "px" : "100%") + "'" +
                        " border='0'" +
                        " style='margin:0; padding:0;'" +
                        ">";
                    content = content +
                        "<tr>";
                    $.each(args.element, function (i) {
                        var eid = args.id + "_" + this.name;
                        var evalue = (this.value != undefined) ? this.value : "";
                        if (this.hidden) {
                            content = content +
                                "<input" +
                                " type='hidden'" +
                                " id='" + eid + "'" +
                                " name='" + this.name + "'" +
                                " value='" + evalue + "'" +
                                " />";
                            return;
                        }
                        if (this.label != undefined) {
                            content = content +
                                "<td" +
                                ((this.label.width != undefined)
                                    ? " width='" + this.label.width + "'" : "") +
                                ">" +
                                "<div style='overflow:hidden;'>" +
                                "<label>" +
                                this.label.title +
                                "</label>" +
                                "</div>" +
                                "</td>";
                        }
                        etype = (this.editable != undefined) ? this.editable.type : "";
                        switch (etype) {
                            case "text":
                                {
                                    content = content +
                                        "<td" +
                                        ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                        " align='" + ((this.align != undefined) ? this.align : "left") + "'" +
                                        ">" +
                                        "<div style='overflow:hidden;'>";
                                    content = content +
                                        "<input" +
                                        " type='text'" +
                                        " id='" + eid + "'" +
                                        " name='" + this.name + "'" +
                                        " value='" + evalue + "'" +
                                        " size='" + this.editable.size + "'" +
                                        " maxlength='" + this.editable.maxlength + "'";
                                    if (this.editable.validate != undefined) {
                                        content = content +
                                            " class='{validate: { " + this.editable.validate.rule + " }}'" +
                                            " title='" + this.editable.validate.message + "'";
                                    }
                                    content = content +
                                        " />" +
                                        "</div>" +
                                        "</td>";
                                }
                                break;
                            case "label":
                                {
                                    content = content +
                                        "<td" +
                                        ((this.width != undefined) ? " width='" + this.width + "'" : "") +
                                        " align='" + ((this.align != undefined) ? this.align : "left") + "'" +
                                        ">" +
                                        "<div style='overflow:hidden;'>";
                                    content = content +
                                        "<span" +
                                        " id='" + eid + "'" +
                                        " name='" + this.name + "'" +
                                        ">" +
                                        evalue +
                                        "</span>"
                                    content = content +
                                        "</div>" +
                                        "</td>";
                                }
                                break;
                        }
                    });
                    content = content +
                        "</tr>"
                    if (args.button != undefined) {
                        content = content +
                            "<tr>" +
                            "<td" +
                            " align='center'" +
                            " valign='middle'" +
                            ">";
                        $.each(args.button, function (i) {
                            var eid = args.id + "_" + this.name;
                            var evalue = (this.value != undefined) ? this.value : "";
                            content = content +
                                "<button class='workButton' style='margin:0; margin-left:10px; padding:0;'" +
                                " type='button'" +
                                " id='" + eid + "'" +
                                " name='" + eid + "'" +
                                ">" +
                                "<span><span><span style='color: #4f4f4f;'>" +
                                "<div style='float:left;" +
                                ((evalue != "")
                                    ? "padding-top: 2px; padding-left:12px;"
                                    : "padding-top: 3px; padding-left:6px;") +
                                "'>" +
                                "<img src='" +
                                gw_com_api.getResource(
                                    "ICON",
                                    (this.icon != undefined) ? this.icon : this.name,
                                    "png") + "'" +
                                " />" +
                                "</div>" +
                                "<div style='float:left; padding-top: 6px; font-family: 굴림체; font-size: 9pt; color: #4f4f4f;'>" +
                                ((evalue != "") ? "&nbsp;" + evalue + "&nbsp;&nbsp;" : "&nbsp;") +
                                "</div>" +
                                "</span></span></span>" +
                                "</button>";
                        });
                        content = content +
                            "</td></tr>"
                    }
                    content = content +
                        "</table>";
                    content = content +
                        "</form>";
                }
                break;
            case "PAGE":
                {
                    // object log ================================================
                    this.objLog({ obj_id: args.page, obj_title: args.title });
                    //============================================================

                    targetobj = "lyrDlg_" + args.page;
                    if ($("#" + targetobj).html() != null) return false;
                    var DataType = (args.datatype != undefined) ? args.datatype : "None";	// by JJJ for File Upload at 2012.9.17
                    var url =
                        ((args.path != undefined) ? args.path : "../Job/") + args.page
                        + ((args.content != undefined) ? "." + args.content : ".aspx");
                    content =
                        "<iframe id='page_" + args.page + "'" +
                        " name='page_" + args.page + "'" +   // for get frame name by JJJ at 2021.03.28
                        " src='" + url +
                        "?NAME=" + args.page +
                        "&LAUNCH=POPUP" +
                        "&TYPE=" + this.v_Current.launch +
                        "&PAGE=" + this.v_Current.window +
                        "&DATA_TYPE=" + DataType +
                        "'" +
                        " width='100%'" +
                        " height='100%'" +
                        " frameborder='no' marginheight=0 marginwidth=0" +
                        ((args.scroll) ? "" : " scrolling='no'") +
                        ">" +
                        "</iframe>";
                    this.v_Current.dialogue = args.page;
                }
                break;
        }

        // 공통 Size 설정 : 파일업로드
        var BoxWidth = args.width;
        var BoxHeight = args.height;
        if (args.page == "DLG_FileUpload") {
            BoxWidth = 650;
            BoxHeight = 380;
        }

        var $dynamic =
            $("<div id='" + targetobj + "' style='overflow:hidden'></div>")
                .html(content)
                .dialog({
                    autoOpen: false,
                    title: "◈ " + args.title,
                    disabled: true,
                    draggable: true,
                    position: (args.locate != undefined) ? args.locate : ['center'],
                    closeOnEscape: false,
                    open: function (event, ui) { if (args.control != true) $(".ui-dialog-titlebar-close").hide(); },
                    closeText: "Exit",
                    modal: true,
                    resizable: args.resize ? args.resize : false,
                    dialogClass: "dialog_window",
                    width: BoxWidth,
                    height: BoxHeight
                });
        $dynamic.dialog();
        if (args.open)
            $dynamic.dialog('open');
        /*
        $dynamic.dialog({
        focus: function(event, ui) {
        }
        });
        */
        return true;

    },

    // open dialogue window.
    dialogueOpen: function (args) {

        this.v_Current.dialogue = args.page;
        $("#lyrDlg_" + args.page).dialog('open');
        if (args.param != undefined) {
            var param = {
                to: { type: "POPUP", page: args.page },
                ID: args.param.ID,
                data: args.param.data
            };
            gw_com_module.streamInterface(param);
        }

    },

    // close dialogue window.
    dialogueClose: function (args) {

        this.v_Current.dialogue = null;
        $("#lyrDlg_" + args.page).dialog('close');

    },

    // set option to dialogue.
    dialogueSet: function (args) {

        $("#lyrDlg_" + args.page).dialog("option", args.name, args.value);

    },

    // validate.
    objValidate: function (args) {

        $.blockUI();
        success = true;
        $.each(args.target, function (i) {
            if (!success) return;
            switch (this.type) {
                case "FORM":
                    {
                        var targetobj = "#" + this.id;
                        var crud = $(targetobj + "_CRUD").val();
                        if (this.check || crud == undefined || crud == "C" || crud == "U") {
                            success = $(targetobj).valid();
                        }
                    }
                    break;
                case "GRID":
                    {
                        var targetobj = "#" + this.id + "_form";
                        success = $(targetobj).valid();
                    }
                    break;
            }
        });
        $.unblockUI();
        return success;

    },

    // Retrieve Data into FORM / GRID / CHART / PAGE
    objRetrieve: function (args) {

        // clear Previous Data & block Target Objects
        if (args.clear != undefined) {
            var param = { target: args.clear, block: args.target };
            this.objClear(param);
        }

        // get Argument values from Source Data
        var data = {};
        var remark = "";
        if (args.source != undefined) {
            if (args.source.type == "INLINE") {
                var param = args.source.argument;
                if (args.source.json) data = gw_com_module.toJSON(param);
                else data = gw_com_module.toARG(param);
            }
            else if (args.source.type == "PARAM") {
                data.query = args.source.argument;
                data.obj = {};
            }
            else {
                var param = { type: args.source.type, targetid: args.source.id, row: args.source.row, element: args.source.element, argument: args.source.argument };
                if (args.source.json) data = gw_com_module.elementtoJSON(param);
                else data = gw_com_module.elementtoARG(param);
                if (args.source.remark) {
                    var param = { type: args.source.type, id: args.source.id, row: args.source.row, remark: args.source.remark };
                    remark = gw_com_module.elementtoRemark(param);
                    $("#" + $("#" + args.source.id).attr("remark") + "_data").text(remark);
                }
                else if (args.source.noremark) {
                    $("#" + args.source.noremark + "_data").text("");
                }
                if (args.source.hide) $("#" + args.source.id).hide();
                else if (args.source.toggle) $("#" + args.source.id).toggle();
                if (args.source.block) $("#" + args.source.id).block();
            }
        }
        else if (args.param != undefined) data.query = args.param;
        else data.query = "";
        if (args.init) return;

        // retrieve Data 
        var len = 0, got = 0;
        $.each(args.target, function (i) {
            var targetobj = "";
            if (this.type == "FORM") {
                len++;
                var targetobj = "#" + this.id;
                if ($("#" + this.id).attr("html")) {
                    var param = {
                        targetid: this.id, url: this.url, params: data.query, query: this.query,
                        handler: this.handler, handler_complete: completeRequest
                    };
                    gw_com_module.htmlRetrieve(param);
                }
                else {
                    var param = {
                        targetid: this.id, url: this.url, params: data.query, query: this.query, crud: this.crud, clear: this.clear, edit: this.edit,
                        creatable: this.creatable, updatable: this.updatable, nodata: this.nodata, handler: this.handler,
                        handler_complete: completeRequest
                    };
                    gw_com_module.formRetrieve(param);
                }
                $.data($(targetobj)[0], "master", data.obj);
            }
            else if (this.type == "GRID") {
                len++;
                var targetobj = "#" + this.id + "_form";
                var param = {
                    targetid: this.id, url: this.url, params: data.query, query: this.query, crud: this.crud,
                    option: this.option, header: this.header, focus: this.focus, search: this.search, select: this.select,
                    handler: this.handler, handler_processed: completeRequest
                };
                if (args.key != undefined) {
                    var query = (this.query != undefined) ? this.query : $("#" + this.id + "_data").attr("query");
                    for (var key_i = 0; key_i < args.key.length; key_i++) {
                        if (args.key[key_i].QUERY == query) {
                            param.key = args.key[key_i].KEY; break;
                        }
                    }
                }
                gw_com_module.gridRetrieve(param);
                if ($(targetobj).length > 0) $.data($(targetobj)[0], "master", data.obj);
                $.data($("#" + this.id)[0], "argument", data.query);
                if (remark != "") $.data($("#" + this.id)[0], "remark", remark);
            }
            else if (this.type == "CHART") {
                var targetobj = "#" + this.id;
                var param = {
                    targetid: this.id, params: "&ACT=retrieve" + data.query, option: args.option, query: this.query,
                    format: (this.format != undefined) ? this.format : {}
                };
                gw_com_module.chartRetrieve(param);
                $.data($(targetobj)[0], "argument", data.query);
            }
            else if (this.type == "PAGE") {
                len++;
                var targetobj = "#" + this.id;
                var param = {
                    targetid: this.id, url: this.url, params: data.query, option: args.option, query: this.query, show: this.show,
                    handler_complete: completeRequest
                };
                gw_com_module.pageRetrieve(param);
            }
        });

        function completeRequest() {

            if (++got == len) {
                if (args.source != undefined && args.source.block)
                    $("#" + args.source.id).unblock();
                if (args.handler_complete != undefined)
                    args.handler_complete();
                else if (args.handler != undefined && args.handler.complete != undefined)
                    args.handler.complete(args.handler.param);
            }

        };

    },

    // export to fixed format.
    objExport: function (args) {

        if (args.target.type == "TAB") {
            var param = {
                tabid: args.target.id,
                name: args.target.name,
                index: args.target.index
            };
            if (!gw_com_module.checkTab(param))
                return;
        }

        if (args.clear != undefined) {
            var param = {
                target: args.clear
            }
            this.objClear(param);
        }

        var data = {};
        if (args.source != undefined) {
            if (args.source.type == "INLINE") {
                var param = args.source.argument;
                if (args.source.json)
                    data = gw_com_module.toJSON(param);
                else
                    data = gw_com_module.toARG(param);
            }
            else {
                var param = {
                    type: args.source.type,
                    targetid: args.source.id,
                    row: args.source.row,
                    element: args.source.element
                };
                if (args.source.json)
                    data = gw_com_module.elementtoJSON(param);
                else
                    data = gw_com_module.elementtoARG(param);
                if (args.source.remark) {
                    var param = {
                        type: args.source.type,
                        id: args.source.id,
                        row: args.source.row,
                        remark: args.source.remark
                    };
                    var remark = gw_com_module.elementtoRemark(param);
                    $("#" + $("#" + args.source.id).attr("remark") + "_data").text(remark);
                }
                if (args.source.toggle)
                    $("#" + args.source.id).toggle();
            }
        }
        else if (args.param != undefined)
            data.query = args.param;
        else
            data.query = "";

        var url = (args.url != undefined) ? args.url
            : ((args.page != undefined) ? args.page : this.v_Current.window) + ".aspx/Print";
        var params = {
            DATA: {
                USER: this.v_Session.USR_ID,
                QUERY: args.query,
                ARGUMENT: {
                    NAME: data.query.ARGUMENT,
                    VALUE: data.query.VALUE
                }
            }
        };
        if (args.option) {
            params.DATA.OPTION = {
                NAME: [],
                VALUE: []
            };
            $.each(args.option, function (i) {
                params.DATA.OPTION.NAME.push(this.name);
                params.DATA.OPTION.VALUE.push(this.value);
            });
        }

        $.blockUI();
        var param = {
            request: "SERVICE",
            url: url,
            params: JSON.stringify(params),
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            switch (args.target.type) {
                case "PAGE":
                    {
                        var targetobj = "#" + args.target.id + "_page";
                        $(targetobj).attr(
                            "src",
                            "../Report/" +
                            ((args.page != undefined) ? args.page : gw_com_module.v_Current.window) +
                            "/" +
                            response);
                        $(targetobj).show();
                    }
                    break;
                case "FILE":
                    {
                        var params =
                            "?TYPE=" +
                            encodeURIComponent("REPORT") +
                            "&NAME=" +
                            encodeURIComponent(
                                ((args.page != undefined) ? args.page : gw_com_module.v_Current.window) +
                                "/" +
                                response);
                        $("#" + args.target.id + "_page").attr("src", "../Service/svc_Download.aspx" + params);
                    }
                    break;
                case "POPUP":
                    {
                        $("#" + args.target.id + "_page").attr("src", "../Report/" + gw_com_module.v_Current.window + "/" + response);
                        $("#lyrExport_" + args.target.name).dialog('open');
                    }
                    break;
                case "TAB":
                    {
                        var param = {
                            tabid: args.target.id,
                            name: args.target.name,
                            index: args.target.index,
                            height: args.target.height,
                            content: "../Report/" +
                                ((args.page != undefined) ? args.page : gw_com_module.v_Current.window) +
                                "/" +
                                response
                        };
                        gw_com_module.addTab(param);
                    }
                    break;
                case "WINDOW":
                    {
                        /*
                        $("#" + this.name + "_window").
                        attr(
                        "href", 
                        "../Report/" +
                        ((args.page != undefined) ? args.page : gw_com_module.v_Current.window) +
                        "/" + 
                        response);
                        $("#" + this.name + "_window").click();
                        */
                    }
                    break;
            }

            /*
            if (gw_com_module.v_Option.message) {
            gw_com_api.messageBox([
            { text: ((args.message != undefined) ? args.message : "정상 처리") + "되었습니다." }
            ], 300, gw_com_api.v_Message.msg_informSaved, "ALERT",
            { handler: args.handler.success, response: response, param: args.handler.param });
            }
            else {
            gw_com_api.showMessage(
            ((args.message != undefined) ? args.message : "정상 처리") + "되었습니다.");

            if (args.handler_success != undefined)
            args.handler_success(response);
            else if (args.handler != undefined
            && args.handler.success != undefined)
            args.handler.success(response, args.handler.param);
            }
            */
            if (args.handler_success != undefined)
                args.handler_success(response);
            else if (args.handler != undefined
                && args.handler.success != undefined)
                args.handler.success(response, args.handler.param);

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();

        };

        function completeRequest() {

            $.unblockUI();

            if (args.handler_complete != undefined)
                args.handler_complete();

        };

    },

    // check updatable.
    objUpdatable: function (args) {

        var updatable = [];
        var refer = 0;
        $.each(args.target, function (i) {
            if (gw_com_module.v_Object[this.id].buffer.insert.length > 0) {
                updatable.push({
                    type: this.type,
                    id: this.id,
                    crud: "C",
                    title: $("#" + this.id).attr("title")
                });
                refer = refer + ((this.refer) ? 0 : 1);
                return;
            }
            if (gw_com_module.v_Object[this.id].buffer.remove.length > 0) {
                updatable.push({
                    type: this.type,
                    id: this.id,
                    crud: "D",
                    title: $("#" + this.id).attr("title")
                });
                refer = refer + ((this.refer) ? 0 : 1);
                return;
            }
            switch (this.type) {
                case "FORM":
                    {
                        var targetobj = "#" + this.id;
                        var crud = $(targetobj + " :input[name='_CRUD']").val();
                        if (crud == "C"
                            || crud == "U") {
                            var update = {
                                type: this.type,
                                id: this.id,
                                crud: crud,
                                title: $(targetobj).attr("title")
                            };
                            updatable.push(update);
                            refer = refer + ((this.refer) ? 0 : 1);
                        }
                    }
                    break;
                case "GRID":
                    {
                        if ($("#" + this.id).attr("sheet")) {
                            var targetobj = "#" + this.id + "_data";
                            var a = $(targetobj).jqGrid('getChangedCells', 'dirty');
                            if ($(targetobj).jqGrid('getChangedCells', 'dirty').length > 0) {
                                var update = {
                                    title: $("#" + this.id).attr("title")
                                };
                                updatable.push(update);
                                refer = refer + ((this.refer) ? 0 : 1);
                            }
                        }
                        else {
                            var targetobj = "#" + this.id + "_form";
                            var element = $(targetobj + " :input[name='_CRUD']");
                            for (var j = 0; j < element.length; j++) {
                                var crud = element[j].value;
                                if (crud == "C"
                                    || crud == "U") {
                                    var row = (element[j].id.split("_"))[0];
                                    var update = {
                                        type: args.target[i].type,
                                        id: args.target[i].id,
                                        row: row,
                                        crud: crud,
                                        title: $("#" + args.target[i].id).attr("title")
                                    };
                                    updatable.push(update);
                                    refer = refer + ((this.refer) ? 0 : 1);
                                    break;
                                }
                            }
                        }
                    }
                    break;
            }
        });
        if (refer > 0) {
            var message = [];
            var title = "";
            var prev = "";
            $.each(updatable, function (i) {
                if (this.title != prev) {
                    if (gw_com_module.v_Option.message)
                        message.push({ text: "◈ " + this.title, align: "left", margin: 30 });
                    else
                        title = title + "◈ " + this.title + " *\n";
                    prev = this.title;
                }
            });
            if (args.check) {
                if (gw_com_module.v_Option.message) {
                    //message.push({ text: "<br>저장되지 않은 데이터가 있습니다." });
                    //message.push({ text: "먼저 저장하신 후에 실행해 주세요." });
                    gw_com_api.messageBox([
                        { text: "데이터가 먼저 저장되어야 합니다." },
                        { text: "저장하신 후에 실행해 주세요." }
                    ]);
                }
                else {
                    title = ((args.message != undefined) ? args.message : "\n데이터가 먼저 저장되어야 합니다.\n저장하신 후에 실행해 주세요.");
                    gw_com_api.showMessage(title);
                    return "SAVE";
                }
            }
            else {
                if (gw_com_module.v_Option.message) {
                    message.push({ text: "<br>저장되지 않은 데이터가 있습니다. 저장하시겠습니까?" });
                    gw_com_api.messageBox(message, 420, gw_com_api.v_Message.msg_confirmSave, "YESNOCANCEL", args.param);
                }
                else {
                    title = title +
                        ((args.message != undefined) ? args.message : "\n저장되지 않은 데이터가 있습니다. 저장하시겠습니까?");
                    if (!gw_com_api.showMessage(title, "yesno"))
                        return "SKIP";
                    else
                        return "SAVE";
                }
            }
            return false;
        }
        if (gw_com_module.v_Option.message)
            return true;
        else
            return "STAY";

    },

    // save.
    objSave: function (args) {

        var url =
            (args.url == "COM") ? "../Service/svc_Update.aspx/Update"
                : (args.url != undefined) ? args.url : this.v_Current.window + ".aspx/Update";
        var data = null;
        if (args.target != undefined) {
            var param = { target: args.target };
            data = gw_com_module.updatabletoARG(param);
        }
        /*else*/
        if (args.param != undefined) {
            var request;
            if (data == null || data == "" || data == undefined) {
                request = {
                    DATA: {
                        USER: (args.user != undefined) ? args.user : this.v_Session.USR_ID,
                        OBJECTS: [],
                        OPTION: {
                            NAME: [],
                            VALUE: []
                        }
                    }
                };
            } else
                request = JSON.parse(data);

            $.each(args.param, function (i) {
                var updatable = {};
                updatable.QUERY = this.query;
                updatable.ROWS = [];
                $.each(this.row, function (j) {
                    var data = {
                        COLUMN: [],
                        VALUE: []
                    };
                    $.each(this.column, function (k) {
                        data.COLUMN.push(encodeURIComponent(this.name));
                        data.VALUE.push(encodeURIComponent(this.value));
                    });
                    data.COLUMN.push("_CRUD");
                    data.VALUE.push(this.crud);
                    updatable.ROWS.push(data);
                });
                request.DATA.OBJECTS.push(updatable);
            });
            if (args.option != undefined) {
                $.each(args.option, function (i) {
                    request.DATA.OPTION.NAME.push(encodeURIComponent(this.name));
                    request.DATA.OPTION.VALUE.push(encodeURIComponent(this.value));
                });
            }
            data = JSON.stringify(request);
        }
        if (data == null) {
            if (args.nomessage != true) {
                if (gw_com_module.v_Option.message)
                    gw_com_api.messageBox([
                        { text: ((args.message != undefined) ? args.message : "저장") + "할 내역이 없습니다." }
                    ], 300);
                else
                    gw_com_api.showMessage(
                        ((args.message != undefined) ? args.message : "저장") + "할 내역이 없습니다.");
            }
            return false;
        }

        $.blockUI();
        var param = {
            request: "SERVICE",
            url: url,
            params: data,
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            if (args.target != undefined) {
                $.each(args.target, function (ii) {
                    gw_com_module.v_Object[this.id].buffer.insert = null;
                    gw_com_module.v_Object[this.id].buffer.insert = [];
                    gw_com_module.v_Object[this.id].buffer.remove = null;
                    gw_com_module.v_Object[this.id].buffer.remove = [];
                });
            }

            if (args.nomessage != true) {
                if (gw_com_module.v_Option.message) {
                    gw_com_api.messageBox([
                        { text: ((args.message != undefined) ? args.message : "저장") + "되었습니다." }
                    ], 300, gw_com_api.v_Message.msg_informSaved, "ALERT",
                        { handler: args.handler.success, response: response, param: args.handler.param });
                }
                else {
                    gw_com_api.showMessage(
                        ((args.message != undefined) ? args.message : "저장") + "되었습니다.");

                    if (args.handler_success != undefined)
                        args.handler_success(response);
                    else if (args.handler != undefined
                        && args.handler.success != undefined)
                        args.handler.success(response, args.handler.param);
                }
            }
            else {
                if (args.handler_success != undefined)
                    args.handler_success(response);
                else if (args.handler != undefined
                    && args.handler.success != undefined)
                    args.handler.success(response, args.handler.param);
            }

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();
            else if (args.handler != undefined
                && args.handler.invalid != undefined)
                args.handler.invalid(args.handler.param);

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();
            else if (args.handler != undefined
                && args.handler.error != undefined)
                args.handler.error(args.handler.param);

        };

        function completeRequest() {

            $.unblockUI();

            if (args.handler_complete != undefined)
                args.handler_complete();
            else if (args.handler != undefined
                && args.handler.complete != undefined)
                args.handler.complete(args.handler.param);

        };

    },

    // delete & save.
    objRemove: function (args) {

        if (gw_com_module.v_Option.message) { }
        else {
            if (!gw_com_api.showMessage(
                "하위 데이터 및 연관 데이터가 모두 함께 삭제됩니다.\n계속 하시겠습니까?",
                "yesno"))
                return;
        }

        var url =
            (args.url == "COM") ? "../Service/svc_Update.aspx/Update"
                : (args.url != undefined) ? args.url : this.v_Current.window + ".aspx/Update";
        var data = null;
        if (args.target != undefined) {
            var param = {
                target: args.target
            };
            data = gw_com_module.keytoARG(param);
        }
        else if (args.param != undefined) {
            var request = {
                DATA: {
                    USER: this.v_Session.USR_ID,
                    OBJECTS: [],
                    OPTION: {
                        NAME: [],
                        VALUE: []
                    }
                }
            };
            $.each(args.param, function (i) {
                var updatable = {};
                updatable.QUERY = this.query;
                updatable.ROWS = [];
                $.each(this.row, function (j) {
                    var data = {
                        COLUMN: [],
                        VALUE: []
                    };
                    $.each(this.column, function (k) {
                        data.COLUMN.push(encodeURIComponent(this.name));
                        data.VALUE.push(encodeURIComponent(this.value));
                    });
                    data.COLUMN.push("_CRUD");
                    data.VALUE.push("D");
                    updatable.ROWS.push(data);
                });
                request.DATA.OBJECTS.push(updatable);
            });
            if (args.option != undefined) {
                $.each(args.option, function (i) {
                    request.DATA.OPTION.NAME.push(encodeURIComponent(this.name));
                    request.DATA.OPTION.VALUE.push(encodeURIComponent(this.value));
                });
            }
            data = JSON.stringify(request);
        }
        if (data == null) {
            if (gw_com_module.v_Option.message)
                gw_com_api.messageBox([
                    { text: "삭제할 내역이 없습니다." }
                ], 300);
            else
                gw_com_api.showMessage("삭제할 내역이 없습니다.");
            return;
        }

        $.blockUI();
        var param = {
            request: "SERVICE",
            url: url,
            params: data,
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            if (gw_com_module.v_Option.message) {
                gw_com_api.messageBox([
                    { text: "삭제되었습니다." }
                ], 300, gw_com_api.v_Message.msg_informRemoved, "ALERT",
                    { handler: args.handler.success, response: response, param: args.handler.param });
            }
            else {
                gw_com_api.showMessage("삭제되었습니다.");

                if (args.handler_success != undefined)
                    args.handler_success(response.tData);
                else if (args.handler != undefined
                    && args.handler.success != undefined)
                    args.handler.success(response, args.handler.param);
            }

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();

        };

        function completeRequest() {

            $.unblockUI();

            if (args.handler_complete != undefined)
                args.handler_complete();

        };

    },

    // import.
    objImport: function (args) {

        var url =
            (args.url == "COM") ? "../Service/svc_Import.aspx/Import"
                : (args.url != undefined) ? args.url : this.v_Current.window + ".aspx/Import";
        var request = {
            DATA: {
                USER: (args.user != undefined) ? args.user : this.v_Session.USR_ID,
                KEY: args.key,
                PATH: args.path,
                SHEET: args.sheet,
                ROW: args.row,
                COLUMN: args.column,
                FIELDS: args.fields
            }
        };
        var data = JSON.stringify(request);

        $.blockUI();
        var param = {
            request: "SERVICE",
            url: url,
            params: data,
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            if (gw_com_module.v_Option.message) {
                gw_com_api.messageBox([
                    { text: ((args.message != undefined) ? args.message : "정상 처리") + "되었습니다." }
                ], 300, gw_com_api.v_Message.msg_informSaved, "ALERT",
                    { handler: args.handler.success, response: response, param: args.handler.param });
            }
            else {
                gw_com_api.showMessage(
                    ((args.message != undefined) ? args.message : "정상 처리") + "되었습니다.");

                if (args.handler_success != undefined)
                    args.handler_success(response);
                else if (args.handler != undefined
                    && args.handler.success != undefined)
                    args.handler.success(response, args.handler.param);
            }

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();
            else if (args.handler != undefined
                && args.handler.invalid != undefined)
                args.handler.invalid(args.handler.param);

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();
            else if (args.handler != undefined
                && args.handler.error != undefined)
                args.handler.error(args.handler.param);

        };

        function completeRequest() {

            $.unblockUI();

            if (args.handler_complete != undefined)
                args.handler_complete();
            else if (args.handler != undefined
                && args.handler.complete != undefined)
                args.handler.complete(args.handler.param);

        };

    },

    // clear object.
    objClear: function (args) {

        if (args.block != undefined) {
            $.each(args.block, function () {
                $("#" + this.id).block();
            });
        }
        if (args.target != undefined) {
            $.each(args.target, function (i) {
                var param = {
                    targetid: this.id
                }
                switch (this.type) {
                    case "FORM":
                        {
                            if ($("#" + this.id).attr("html"))
                                gw_com_module.htmlClear(param);
                            else
                                gw_com_module.formClear(param);
                        }
                        break;
                    case "GRID":
                        {
                            gw_com_module.gridClear(param);
                        }
                        break;
                    case "CHART":
                        {
                            var targetobj = "#" + this.id;
                            var param = {
                                targetid: this.id,
                                params: "&ACT=clear",
                                query: this.query,
                                format: {}
                            };
                            gw_com_module.chartRetrieve(param);
                        }
                        break;
                }
            });
        }
        if (args.block != undefined) {
            $.each(args.block, function () {
                $("#" + this.id).unblock();
            });
        }

    },

    // toggle object.
    objToggle: function (args) {

        $.each(args.target, function (i) {
            if (this.element != undefined) {
                if (this.grid) {
                }
                else
                    this.id = "#" + this.id + "_" + this.element;
            }
            else
                this.id = "#" + this.id;
        });
        $.each(args.target, function (i) {
            (this.show) ? $(this.id).show()
                : (this.hide) ? $(this.id).hide() : $(this.id).toggle();
            if (this.focus
                && $(this.id).css("display") != "none") {
                var focus = $(this.id).attr("focus");
                if (focus != undefined) {
                    var el = this.id + "_" + focus;
                    ($(el).attr("type") == "text" || $(el).attr("type") == "textarea")
                        ? $(el).select() : $(el).focus();
                }
                else
                    $(this.id).focus();
            }
        });

    },

    // auto resize.
    objResize: function (args) {

        $.each(args.target, function (i) {
            switch (this.type) {
                case "FORM":
                    {
                        var wrapperobj = "#" + this.id + "_wrap";
                        var targetobj = "#" + this.id + "_data";
                        this.width = $(targetobj).width();
                        var size = $(wrapperobj).width() - this.offset;
                        if (size > this.width)
                            $(targetobj).css("width", size);
                    }
                    break;
                case "GRID":
                    {
                        var wrapperobj = "#" + this.id;
                        var targetobj = "#" + this.id + "_data";
                        this.width = $(targetobj).width();
                        var size = $(wrapperobj).width() - this.offset;
                        if (size > this.width)
                            $(targetobj).setGridWidth(size, true);
                        else if (this.min != true)
                            $(targetobj).setGridWidth(size, false);
                    }
                    break;
                case "TAB":
                    {
                        $("#" + this.id).bind("tabsshow", function (event, ui) {
                            switch ($(ui.tab).attr("type")) {
                                case "FORM":
                                    {
                                        var wrapperobj = "#" + $(ui.tab).attr("target") + "_wrap";
                                        var targetobj = "#" + $(ui.tab).attr("target") + "_data";
                                        width = $(targetobj).width();
                                        var size = $(wrapperobj).width() - args.target[i].offset;
                                        if (size > width)
                                            $(targetobj).css("width", size);
                                    }
                                    break;
                                case "GRID":
                                    {
                                        var wrapperobj = "#" + $(ui.tab).attr("target");
                                        var targetobj = "#" + $(ui.tab).attr("target") + "_data";
                                        width = $(targetobj).width();
                                        var size = $(wrapperobj).width() - args.target[i].offset;
                                        if (size > width)
                                            $(targetobj).setGridWidth(size, true);
                                        else if (this.min != true)
                                            $(targetobj).setGridWidth(size, false);
                                    }
                                    break;
                            }
                            if (gw_com_module.v_Current.loaded)
                                gw_com_module.informSize();
                        });
                    }
                    break;
                default:
                    {
                        var wrapperobj = "#" + this.id + "_wrap";
                        var size = $(wrapperobj).width() - this.offset;
                        $(wrapperobj).css("width", size);
                    }
                    break;
            }

        });

        $(window).bind('resize', function () {
            //function resizeDW() {

            $.each(args.target, function (i) {
                switch (this.type) {
                    case "FORM":
                        {
                            var wrapperobj = "#" + this.id + "_wrap";
                            var targetobj = "#" + this.id + "_data";
                            var size = $(wrapperobj).width() - this.offset;
                            if (size > this.width)
                                $(targetobj).css("width", size);
                        }
                        break;
                    case "GRID":
                        {
                            var wrapperobj = "#" + this.id;
                            var targetobj = "#" + this.id + "_data";
                            var size = $(wrapperobj).width() - this.offset;
                            if (size > this.width)
                                $(targetobj).setGridWidth(size, true);
                            else if (this.min != true)
                                $(targetobj).setGridWidth(size, false);
                        }
                        break;
                    default:
                        {
                            /*
                            var wrapperobj = "#" + this.id + "_wrap";
                            var size = $(wrapperobj).width() - this.offset;
                            $(wrapperobj).css("width", size);
                            */
                        }
                        break;
                }
            });

            //}
        }).trigger('resize');

    },

    // toggle style.
    styleToggle: function (args) {

        var style = "";
        $.each(args.style, function (i) {
            if (i > 0)
                style = style + " ";
            style = style + args[i].style;
        });
        if (args.element != undefined) {
            if (args.grid) {
            }
            else {
                targetobj = "#" + args.targetid + "_" + args.element;
            }
        }
        else
            targetobj = "#" + args.targetid;
        $(targetobj).toggleClass(style);

    },

    // call procedure.
    callProcedure: function (args) {

        var url =
            (args.url == "COM")
                ? "../Service/svc_Procedure.aspx/" + ((args.tran) ? "Exec" : "Call")
                : (args.url != undefined) ? args.url : this.v_Current.window + ".aspx/" + ((args.tran) ? "Exec" : "Call");
        var request = {
            DATA: {
                QUERY: args.procedure,
                ARGUMENT: {
                    NAME: [],
                    VALUE: []
                },
                INPUT: {
                    NAME: [],
                    VALUE: [],
                    TYPE: []
                },
                OUTPUT: {
                    NAME: [],
                    VALUE: [],
                    TYPE: []
                }
            }
        };
        if (args.argument != undefined) {
            $.each(args.argument, function () {
                request.DATA.ARGUMENT.NAME.push(encodeURIComponent(this.name));
                request.DATA.ARGUMENT.VALUE.push(encodeURIComponent(this.value));
            });
        }
        if (args.input != undefined) {
            $.each(args.input, function () {
                request.DATA.INPUT.NAME.push(encodeURIComponent(this.name));
                request.DATA.INPUT.VALUE.push(encodeURIComponent(this.value));
                request.DATA.INPUT.TYPE.push(encodeURIComponent(this.type));
            });
        }
        if (args.output != undefined) {
            $.each(args.output, function () {
                request.DATA.OUTPUT.NAME.push(encodeURIComponent(this.name));
                request.DATA.OUTPUT.VALUE.push((this.value ? encodeURIComponent(this.value) : ""));
                request.DATA.OUTPUT.TYPE.push(encodeURIComponent(this.type));
            });
        }
        var data = JSON.stringify(request);

        $.blockUI();
        var param = {
            request: "SERVICE",
            url: url,
            params: data,
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            if (gw_com_module.v_Option.message) {
                if (args.nomessage != true)
                    gw_com_api.messageBox([
                        { text: ((args.message != undefined) ? args.message : "정상 처리") + "되었습니다." }
                    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
                        { handler: args.handler.success, response: response, param: args.handler.param });
                else {
                    if (args.handler_success != undefined)
                        args.handler_success(response);
                    else if (args.handler != undefined
                        && args.handler.success != undefined)
                        args.handler.success(response, args.handler.param);
                }
            }
            else {
                if (args.nomessage != true) {
                    gw_com_api.showMessage(
                        ((args.message != undefined) ? args.message : "정상 처리") + "되었습니다.");
                }

                if (args.handler_success != undefined)
                    args.handler_success(response);
                else if (args.handler != undefined
                    && args.handler.success != undefined)
                    args.handler.success(response, args.handler.param);
            }

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();
            else if (args.handler != undefined
                && args.handler.invalid != undefined)
                args.handler.invalid(args.handler.param);

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();
            else if (args.handler != undefined
                && args.handler.error != undefined)
                args.handler.error(args.handler.param);

        };

        function completeRequest() {

            $.unblockUI();

            if (args.handler_complete != undefined)
                args.handler_complete();
            else if (args.handler != undefined
                && args.handler.complete != undefined)
                args.handler.complete(args.handler.param);

        };

    },

    // call for request.
    callRequest: function (args) {

        var params = (args.params != undefined) ? args.params : "{}";
        switch (args.request) {
            case "FILE":
                {
                    $.ajax({
                        url: "../Data/" + encodeURIComponent(args.url),
                        dataType: 'json',
                        data: "{}",
                        success: function (data, status) {
                            if (data.length <= 0) {
                                alert("* " + args.name + "\n\n데이터를 조회할 수 없습니다.");
                                if (args.handler_invalid != undefined)
                                    args.handler_invalid(args.request, args.name);
                                return;
                            }
                            if (args.handler_success != undefined)
                                args.handler_success(args.request, args.name, data);
                        },
                        error: function (xmlRequest) {
                            alert(
                                xmlRequest.status + '\r\n' + xmlRequest.statusText + '\r\n' + xmlRequest.responseText);
                            if (args.handler_error != undefined)
                                args.handler_error();
                        },
                        complete: function (xmlRequest, status) {
                            if (args.handler_complete != undefined)
                                args.handler_complete();
                        }
                    });
                }
                break;

            case "DATA":
                {
                    $.ajax({
                        url: args.url,
                        type: 'post',
                        //dataType: 'json',
                        //contentType: "application/json; charset=utf-8",
                        cache: false,
                        async: args.async == undefined ? false : args.async,
                        data: params,
                        success: function (data, status) {
                            var response = JSON.parse(data);
                            if (response.iCode != 0) {
                                alert("* " + args.name + "\n\n데이터를 조회할 수 없습니다.\n - " + response.tData);
                                if (args.handler_invalid != undefined)
                                    args.handler_invalid(args.request, args.name);
                                return;
                            }
                            if (args.handler_success != undefined)
                                args.handler_success(args.request, args.name, response.tData);
                        },
                        error: function (xmlRequest) {
                            alert(
                                xmlRequest.status + '\r\n' + xmlRequest.statusText + '\r\n' + xmlRequest.responseText);
                            if (args.handler_error != undefined)
                                args.handler_error();
                        },
                        complete: function (xmlRequest, status) {
                            if (args.handler_complete != undefined)
                                args.handler_complete();
                        }
                    });
                }
                break;

            case "PAGE":
                {
                    if (args.block)
                        $.blockUI();
                    $.ajax({
                        url: args.url,
                        type: 'post',
                        //dataType: 'json',
                        //contentType: "application/json; charset=utf-8",
                        cache: false,
                        async: args.async == undefined ? false : args.async,
                        data: params,
                        success: function (data, status) {
                            var response = JSON.parse(data);
                            if (response.iCode != 0) {
                                alert(response.tData);
                                if (args.handler_invalid != undefined)
                                    args.handler_invalid();
                                return;
                            }
                            if (args.handler_success != undefined)
                                args.handler_success(response.tData);
                        },
                        error: function (xmlRequest) {
                            alert(
                                xmlRequest.status + '\r\n' + xmlRequest.statusText + '\r\n' + xmlRequest.responseText);
                            if (args.handler_error != undefined)
                                args.handler_error();
                        },
                        complete: function (xmlRequest, status) {
                            if (args.block)
                                $.unblockUI();
                            if (args.handler_complete != undefined)
                                args.handler_complete();
                        }
                    });
                }
                break;

            case "SERVICE":
                {
                    if (args.block) $.blockUI();
                    $.ajax({
                        url: args.url, type: 'post', dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        cache: false, async: args.async == undefined ? false : args.async,
                        data: params,
                        success: function (data, status) {
                            var response = JSON.parse(data.d);
                            if (response.iCode != undefined && response.iCode != 0) {
                                alert(response.tData);
                                if (args.handler_invalid != undefined) args.handler_invalid();
                                return;
                            }
                            if (args.handler_success != undefined) args.handler_success(response.tData);
                        },
                        error: function (xmlRequest) {
                            alert(xmlRequest.status + '\r\n' + xmlRequest.statusText + '\r\n' + xmlRequest.responseText);
                            if (args.handler_error != undefined) args.handler_error();
                        },
                        complete: function (xmlRequest, status) {
                            if (args.handler_complete != undefined) args.handler_complete();
                        }
                    });
                }
                break;

        }   // switch (args.request)

    },  // callRequest

    // upload. (file)
    uploadFile: function (args) {

        switch (args.control.by) {
            case "DX":
                {
                    if (args.control.id.GetText() == "") {
                        if (gw_com_module.v_Option.message)
                            gw_com_api.messageBox([
                                { text: "업로드할 파일을 선택해 주세요." }
                            ]);
                        else
                            gw_com_api.showMessage("업로드할 파일을 선택해 주세요.");
                        return;
                    }

                    $.blockUI();
                    ctlUpload.UploadFile();
                }
                break;
        }

    },

    // download. (file)
    downloadFile: function (args) {

        var row = (args.source.row == "selected")
            ? gw_com_api.getSelectedRow(args.source.id) : args.source.row;
        if (row == null) {
            if (gw_com_module.v_Option.message)
                gw_com_api.messageBox([
                    { text: "다운로드할 파일이 선택되지 않았습니다." }
                ]);
            else
                gw_com_api.showMessage("다운로드할 파일이 선택되지 않았습니다.");
            return false;
        }
        var id = gw_com_api.getValue(args.source.id, row, "file_id", true);
        if (args.view != undefined && args.view == true) {
            if (gw_com_api.getColNumber(args.source.id, row, "file_path") < 0) {
                $("#" + args.targetid + "_page").attr("src", "../Service/svc_DownloadById.aspx?" + encodeURIComponent(id));
            }
        }
        else {
            if (gw_com_api.getColNumber(args.source.id, row, "file_path") < 0) {
                $("#" + args.targetid + "_page").attr("src", "../Service/svc_DownloadById.aspx?" + encodeURIComponent(id));
            } else {
                var params =
                    "?TYPE=" + encodeURIComponent("FILE") +
                    "&USER=" + encodeURIComponent(gw_com_module.v_Session.USR_ID) +
                    "&ID=" + encodeURIComponent(id) +
                    "&PATH=" +
                    encodeURIComponent(
                        gw_com_api.getValue(args.source.id, row, "file_path", true)) +
                    "&NAME=" +
                    encodeURIComponent(
                        gw_com_api.getValue(args.source.id, row, "file_nm", true));
                $("#" + args.targetid + "_page").attr("src", "../Service/svc_Download.aspx" + params);
            }
        }

    },

    // initialize.
    initPage: function (args) {

        $.blockUI();
        this.v_Current.window = gw_com_api.getPageParameter("NAME");
        this.v_Current.launch = gw_com_api.getPageParameter("LAUNCH");
        this.v_Current.menu_args = gw_com_api.getPageParameter("MENU_ARGS");
        this.v_Current.caller.type = gw_com_api.getPageParameter("TYPE");
        if (gw_com_api.getPageParameter("IFRAME") != "") this.v_Current.iframe = true;
        this.v_Current.caller.page = gw_com_api.getPageParameter("PAGE");
        if (args != undefined) {
            if (args.authority) {
                this.v_Option.authority.usable = true;
                if (gw_com_api.getPageParameter("AUTH") != "")
                    this.v_Option.authority.control = gw_com_api.getPageParameter("AUTH");
            }
            this.v_Option.message = (args.message) ? true : false;
            this.v_Option.datatype = gw_com_api.getPageParameter("DATA_TYPE");
        }

        //if (this.v_Current.launch != "" && typeof top != "undefined") {
        if (this.v_Current.launch != "") {

            if (typeof top != "undefined" && typeof top.v_Session != "undefined") {

                this.v_Session = top.v_Session;

            } else {

                var param = {
                    request: "PAGE",
                    url: "../Service/svc_Session.aspx",
                    async: false,
                    handler_success: successSession,
                    handler_invalid: invalidSession
                };
                this.callRequest(param);

                function successSession(data) {

                    gw_com_module.v_Session.USR_ID = data.USR_ID;
                    gw_com_module.v_Session.GW_ID = data.GW_ID;
                    gw_com_module.v_Session.USR_NM = data.USR_NM;
                    gw_com_module.v_Session.EMP_NO = data.EMP_NO;
                    gw_com_module.v_Session.DEPT_CD = data.DEPT_CD;
                    gw_com_module.v_Session.DEPT_NM = data.DEPT_NM;
                    gw_com_module.v_Session.POS_CD = data.POS_CD;
                    gw_com_module.v_Session.POS_NM = data.POS_NM;
                    gw_com_module.v_Session.DEPT_AREA = data.DEPT_AREA;
                    gw_com_module.v_Session.DEPT_AUTH = data.DEPT_AUTH;
                    gw_com_module.v_Session.USER_TP = data.USER_TP;

                };

                function invalidSession(data) {

                    if (top.getSession == undefined) {
                        //
                    } else {
                        var args = {
                            ID: gw_com_api.v_Stream.msg_showLogin
                        };
                        gw_com_module.streamInterface(args);
                    }

                };

            }

        }

        return gw_com_api.getPageParameter("PARAM");

    },

    // start to process.
    startPage: function () {

        this.informSize();
        $.unblockUI();
        if (this.v_Current.act != null)
            $("#" + this.v_Current.act).focus();

    },

    // inform height.
    informSize: function () {

        if (parent.resizeFrame != undefined) {
            var height = $("#docBody").height();
            var args = {
                id: this.v_Current.window,
                height: (height == null) ? $(document).height() : height
            };
            parent.resizeFrame(args);
            this.v_Current.loaded = true;
        }

    },

    // interface stream.
    streamInterface: function (args) {

        if (this.v_Session.IfCnt == undefined) this.v_Session.IfCnt = 1;
        else this.v_Session.IfCnt++;

        args.from = {
            type: this.v_Current.launch,
            page: this.v_Current.window
        };

        // for Debugging
        //if (console != undefined && console != null)
        //    console.log("from = %s , args = %s", JSON.stringify(args.from), JSON.stringify(args));
        //var pageName = "";

        if (args.ID == gw_com_api.v_Stream.msg_showLogin || args.from.page == "LoginProcess") {
            top.streamProcess(args); return;
        }
        else if (args.to != undefined && args.to.type == "PARENT") {
            if (parent.streamProcess != undefined)
                parent.streamProcess(args);
            else
                alert(" No Parent : " + this.v_Current.window);
        }

        if (this.v_Current.launch == "MAIN" || (args.to != undefined && args.to.type == "POPUP")) {
            if (args.to.page != undefined && callFrameInterface("page_" + args.to.page, args)) return
            if (this.v_Current.dialogue != null && callFrameInterface("page_" + this.v_Current.dialogue, args)) return

            if ($.browser.msie) {
                for (i = 0; i < frames.length; i++) {
                    if (frames[i].frames["page_" + args.to.page] != undefined) {
                        frames[i].frames["page_" + args.to.page].streamProcess(args); return;
                    }
                }
            }
            else {
                for (i = 0; i < frames.length; i++) {
                    if (frames[i].frames != undefined) {
                        var childFrame = getFrameByName(frames[i], "page_" + args.to.page)
                        if (childFrame != undefined) {
                            fchildFrame.streamProcess(args); return;
                        }
                    }
                }
            }
            //alert(" Child Frame : " + this.v_Current.window + "\n" + " To Page : " + args.to.page);

        }
        else if (parent != undefined) {
            parent.streamProcess(args);
        }
        else alert(" no interface" + JSON.stringify(args));

        return;

        // find Frame by page name & call streamInterface
        function callFrameInterface(pageName, args) {
            if ($.browser.msie) {
                if (frames.length < 1) return false;
                if (frames[pageName] != undefined) {
                    if (frames[pageName].streamProcess != undefined)
                        frames[pageName].streamProcess(args);
                    //else
                    //    alert(" cannot acces : " + pageName);
                    return true;
                }
            }
            else {
                for (var i = 0; i < frames.length; i++) {
                    if (frames[i].name == pageName) {
                        if (frames[i].streamProcess != undefined)
                            frames[i].streamProcess(args);
                        //else
                        //    alert(" cannot acces : " + pageName);
                        return true;
                    }
                }
            }
            return false;
        }

        function getFrameByName(_objs, _name) {

            if ($.browser.msie) {
                if (_obj[_name] != undefined) return _obj[_name];
            }
            else {
                for (var i = 0; i < _objs.length; i++) {
                    if (_objs[i].name == _name) return _objs[i];
                }
            }
            return undefined;
        }

    },

    // send EMail.
    sendMail: function (args) {

        if (args.to == undefined || args.to == null || args.to.length == 0) args.edit = true;
        if (args.edit == true) {

            window.open("", "pop_email", "scrollbars=no,resizable=yes,menubar=no,toolbar=no,width=1100,height=660");

            // Create Form Data
            var frmId = "lyrEmailData";
            if ($("#" + frmId).size() == 0) {
                $("body").append("<form id=\"" + frmId + "\"/>");
                $("#" + frmId).append("<input type=\"hidden\" name=\"_args\" value=\"\"/>");
            }

            // Parameter Value Setting
            $("input[name=\"_args\"]").attr("value", JSON.stringify(args));

            $("#" + frmId).attr("action", "../Job/DLG_EMAIL.aspx?USR_ID=" + gw_com_module.v_Session.USR_ID);
            $("#" + frmId).attr("target", "pop_email");
            $("#" + frmId).attr("method", "post");
            $("#" + frmId).submit().remove();

            return true;
        }

        var url =
            (args.url == "COM") ? "../Service/svc_SendMail.aspx/sendMail"
                : (args.url != undefined) ? args.url : this.v_Current.window + ".aspx/sendMail";

        var request = {
            DATA: {
                SECTION: (args.section == undefined ? "" : args.section),
                //FROM: (args.from == undefined ? "" : args.from.name + "<" + args.from.value + ">"),
                TO: [],
                CC: [],
                SUBJECT: encodeURIComponent(args.subject == undefined ? "제목없음" : args.subject),
                BODY: encodeURIComponent(args.body),
                HTML: (args.html == undefined ? false : args.html),
                STRETCH: (args.stretch == undefined ? true : args.stretch),
                OUTPUT: {
                    NAME: [],
                    VALUE: []
                }
            }
        };
        if (args.to != undefined) {
            $.each(args.to, function () {
                request.DATA.TO.push(this.name == "" ? this.value : this.name + "<" + this.value + ">");
            });
        } else if (args.mailing != undefined) {
            var data = gw_com_module.getMailingList(args.mailing);
            $.each(data, function () {
                request.DATA.TO.push(this.DATA[0] == "" ? this.DATA[1] : this.DATA[0] + "<" + this.DATA[1] + ">");
            });
        }

        if (request.DATA.TO.length == 0) {
            errorRequest();
        }

        if (args.cc != undefined) {
            $.each(args.cc, function () {
                request.DATA.CC.push(this.name == "" ? this.value : this.name + "<" + this.value + ">");
            });
        }
        var data = JSON.stringify(request);

        $.blockUI();
        var param = {
            request: "SERVICE",
            url: url,
            params: data,
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(response) {

            if (args.nomessage != true) {
                if (gw_com_module.v_Option.message) {
                    var message = ((args.message != undefined) ? args.message : "메일이 발송") + "되었습니다.";
                    if (args.handler == undefined || args.handler.success == undefined) {
                        gw_com_api.messageBox([{ text: message }], 300, gw_com_api.v_Message.msg_informSended, "ALERT");
                    } else {
                        gw_com_api.messageBox([{ text: message }], 300, gw_com_api.v_Message.msg_informSended, "ALERT",
                            { handler: args.handler.success, response: response, param: args.handler.param });
                    }
                }
                else {
                    gw_com_api.showMessage(
                        ((args.message != undefined) ? args.message : "메일이 발송") + "되었습니다.");

                    if (args.handler_success != undefined)
                        args.handler_success(response);
                    else if (args.handler != undefined
                        && args.handler.success != undefined)
                        args.handler.success(response, args.handler.param);
                }
            }
            else {
                if (args.handler_success != undefined)
                    args.handler_success(response);
                else if (args.handler != undefined
                    && args.handler.success != undefined)
                    args.handler.success(response, args.handler.param);
            }

        };

        function invalidRequest() {

            if (args.handler_invalid != undefined)
                args.handler_invalid();
            else if (args.handler != undefined
                && args.handler.invalid != undefined)
                args.handler.invalid(args.handler.param);

        };

        function errorRequest() {

            if (args.handler_error != undefined)
                args.handler_error();
            else if (args.handler != undefined
                && args.handler.error != undefined)
                args.handler.error(args.handler.param);

        };

        function completeRequest() {

            $.unblockUI();

            if (args.handler_complete != undefined)
                args.handler_complete();
            else if (args.handler != undefined
                && args.handler.complete != undefined)
                args.handler.complete(args.handler.param);

        };

    },

    // send EMail. aync:false
    getMailingList: function (id) {
        var rtn;
        var param = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx?QRY_ID=SYS_2080_2&QRY_COLS=name,email&CRUD=R&arg_list_id=" + id + "&arg_use_yn=1",
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        gw_com_module.callRequest(param);
        //----------
        function successRequest(param) {
            rtn = param;
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================

        return rtn;
    },

    // Encrypt. aync:false
    Encrypt: function (str) {

        var rtn = "";
        var data = { _str: encodeURIComponent(str) };
        var param = {
            request: "SERVICE",
            url: "../Service/svc_Encrypt.aspx/Encrypt",
            async: false,
            params: JSON.stringify(data),
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(param) {
            rtn = param;
        }
        //----------
        function invalidRequest(param) {
        }
        //----------
        function errorRequest(param) {
        }
        //----------
        function completeRequest(param) {
        }
        return rtn;
    },

    // Decrypt. aync:false
    Decrypt: function (str) {

        var rtn = "";
        var data = { _str: str };
        var param = {
            request: "SERVICE",
            url: "../Service/svc_Encrypt.aspx/Decrypt",
            async: false,
            params: JSON.stringify(data),
            handler_success: successRequest,
            handler_invalid: invalidRequest,
            handler_error: errorRequest,
            handler_complete: completeRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(param) {
            rtn = param;
        }
        //----------
        function invalidRequest(param) {
        }
        //----------
        function errorRequest(param) {
        }
        //----------
        function completeRequest(param) {
        }
        return rtn;
    },

    // Create Object Launch Log
    objLog: function (param) {

        var proc = {
            url: "COM",
            nomessage: true,
            procedure: "sp_zobject_log",
            input: [
                { name: "obj_id", value: param.obj_id, type: "nvarchar" },
                { name: "obj_title", value: param.obj_title, type: "nvarchar" },
                { name: "pobj_id", value: this.v_Current.window, type: "nvarchar" },
                { name: "user_id", value: this.v_Session.USR_ID, type: "varchar" }
            ]
        };
        this.callProcedure(proc);

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//