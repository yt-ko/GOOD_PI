//------------------------------------------
// API about Common UI Processing.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

var gw_com_api = {

    // variable.
    v_Key: {
        key_enter: 13
    },
    v_Stream: {
        msg_showLogin: 0,
        //msg_setKey: 1,
        msg_processPage: 10,
        msg_closePage: 11,
        msg_showMessage: 12,
        msg_resultMessage: 13,
        msg_myInformation: 20,
        msg_myNotice: 21,
        msg_linkPage: 31,
        msg_refreshPage: 32,
        msg_selectedData: 99,
        msg_selectCustomer: 100,
        msg_selectedCustomer: 101,
        msg_editASEquipment: 103,
        msg_selectSupplier: 104,
        msg_selectedSupplier: 105,
        msg_selectEmployee_SCM: 106,
        msg_selectedEmployee_SCM: 107,
        msg_selectPart_SCM: 108,
        msg_selectedPart_SCM: 109,
        msg_upload_CEM: 110,
        msg_uploaded_CEM: 111,
        msg_selectModelClass: 112,
        msg_selectedModelClass: 113,
        msg_upload_NOTICE: 114,
        msg_uploaded_NOTICE: 115,
        msg_selectProduct_EHM: 116,
        msg_selectedProduct_EHM: 117,
        msg_upload_ASISSUE: 118,
        msg_uploaded_ASISSUE: 119,
        msg_edit_ASISSUE: 120,
        msg_edited_ASISSUE: 121,
        msg_selectedSupplier_User: 122,
        msg_upload_ASFOLDER: 125,
        msg_uploaded_ASFOLDER: 126,
        msg_infoAS: 127,
        msg_selecttoEstimate: 128,
        msg_selectedtoEstimate: 129,
        msg_selectProduct_QCM: 130,
        msg_selectedProduct_QCM: 131,
        msg_selectPart_QCM: 132,
        msg_selectedPart_QCM: 133,
        msg_selectProduct_MRP: 134,
        msg_selectedProduct_MRP: 135,
        msg_selectPart_MRP: 136,
        msg_selectedPart_MRP: 137,
        msg_selectProject_MRP: 138,
        msg_selectedProject_MRP: 139,
        msg_selectProcess_MRP: 140,
        msg_selectedProcess_MRP: 141,
        msg_selectStatsClass: 142,
        msg_selectedStatsClass: 143,
        msg_selectEstimate: 144,
        msg_selectedEstimate: 145,
        msg_selectPreEstimate: 146,
        msg_selectedPreEstimate: 147,
        msg_selectProduct_PDM: 148,
        msg_selectedProduct_PDM: 149,
        msg_upload_SMWORK: 150,
        msg_uploaded_SMWORK: 151,
        msg_editMaterial: 152,
        msg_selectPreModel: 153,
        msg_selectedPreModel: 154,
        msg_selectModel: 155,
        msg_selectedModel: 156,
        msg_upload_ASSETUP: 157,
        msg_uploaded_ASSETUP: 158,
        msg_upload_QMPROC: 159,
        msg_uploaded_QMPROC: 160,
        msg_copyPreModel: 161,
        msg_copiedPreModel: 162,
        msg_copyPreIndex: 163,
        msg_copiedPreIndex: 164,
        msg_copyPreEstimate: 165,
        msg_copiedPreEstimate: 166,
        msg_selectPart_ERP: 167,
        msg_selectedPart_ERP: 168,
        msg_infoFualty: 169,
        msg_infoMProcess: 170,
        msg_infoOrders: 171,
        msg_selectProject_SCM: 172,
        msg_selectedProject_SCM: 173,
        msg_selectPart_Stock: 174,
        msg_selectedPart_Stock: 175,
        msg_upload_ECCB: 176,
        msg_uploaded_ECCB: 177,
        msg_selectECR: 178,
        msg_selectedECR: 179,
        msg_edit_Memo: 180,
        msg_edited_Memo: 181,
        msg_selectProcess_SCM: 182,
        msg_selectedProcess_SCM: 183,
        msg_selectLT: 182,
        msg_selectedLT: 183,
        msg_selectECCBItem: 182,
        msg_selectedECCBItem: 183,
        msg_selectECOItem: 184,
        msg_selectedECOItem: 185,
        msg_edit_HTML: 186,
        msg_edited_HTML: 187,
        msg_selectCIP: 188,
        msg_selectedCIP: 189,
        msg_infoEstimate: 190,
        msg_selectECO: 191,
        msg_selectedECO: 192,
        msg_infoECCBItem: 193,
        msg_selectEVLItem: 196,
        msg_selectedEVLItem: 197,
        msg_edit_SMS: 198,
        msg_edited_SMS: 199,
        msg_linkTabPage: 220,
        msg_selectDepartment: 301,
        msg_selectedDepartment: 302,
        msg_selectPart_AS: 303,
        msg_selectedPart_AS: 304,
        msg_selectPart: 701,
        msg_selectedPart: 702,
        msg_selectProcess: 703,
        msg_selectedProcess: 704,
        msg_selectSupplier: 705,
        msg_selectedSupplier: 706,
        msg_selectEmployee: 707,
        msg_selectedEmployee: 708,
        msg_selectProject: 709,
        msg_selectedProject: 710,
        msg_selectPart_EHM: 711,
        msg_selectedPart_EHM: 712,
        msg_selectedPart_EHM_1: 713,
        msg_selectedPart_EHM_2: 714,
        msg_selectTeam: 715,
        msg_selectedTeam: 716,
        msg_upload_EHM: 717,
        msg_uploaded_EHM: 718,
        msg_retrieve: 201,
        msg_remove: 202,
        msg_authSystem: 500,
        msg_authedSystem: 501,
        msg_interfaceSystem: 502,
        msg_interfacedSystem: 503,
        msg_openDialogue: 1000,
        msg_openedDialogue: 1001,
        msg_closeDialogue: 1002,
        msg_processedDialogue: 1003,
        GW_msg_upload_WORK: 5001,
        GW_msg_uploaded_WORK: 5002
    },
    v_Message: {
        msg_alert: 1,
        msg_confirmSave: 2,
        msg_confirmRemove: 3,
        msg_informSaved: 4,
        msg_informRemoved: 5,
        msg_confirmBatch: 6,
        msg_informBatched: 7,
        msg_confirmSend: 8,
        msg_informSendable: 9,
        msg_informSend: 10,
        msg_informSended: 11
    },

    // get resource.
    //#region
    getResource: function (type, name, ext) {

        switch (type) {
            case "MASTER":
                return "../style/images/master/" + name + "." + ext;
            case "BUTTON":
                return "../style/images/common/button/btn" + name + "." + ext;
            case "ICON":
                return "../style/images/common/button/icon" + name + "." + ext;
            default:
                return "";
        }

    },
    //#endregion

    // get resource.
    //#region
    changeTheme: function (id, type, optimize) {

        var obj = "#" + id;
        var style = (type != "" && type != undefined) ? type : this.getPageParameter("STYLE");
        switch (style) {
            case "2":
                $(obj).attr("href", "../Style/theme-redmond/jquery-ui-1.8.9.custom.css");
                break;
            case "3":
                $(obj).attr("href", "../Style/theme-lightness/jquery-ui-1.8.9.custom.css");
                break;
            default:
                $(obj).attr("href", "../Style/theme-smoothness/jquery-ui-1.8.9.custom.css");
                break;
        }
        $(obj + "_tab").attr("href", "../Style/lib" + ((optimize) ? ".o" : "") + ".ui.tabs.css");
        $(obj + "_grid").attr("href", "../Style/lib.grid.report.css");

    },
    //#endregion

    // get page id.
    // #region
    getPageID: function () {

        return gw_com_module.v_Current.window;

    },

    // get page parameter. (get method)
    // #region
    getPageParameter: function (name) {

        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) return "";
        else return decodeURIComponent(results[1].replace(/\+/g, " "));

    },

    // get parameter. (get method parsing)
    // #region
    getParameter: function (param, name) {

        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(param);
        if (results == null) return "";
        else return decodeURIComponent(results[1].replace(/\+/g, " "));

    },

    // set parameter.
    // #region
    setParameter: function (param, name, value) {

        if (value == null) {
            value = "";
        }
        var pattern = new RegExp("\\b(" + name + "=).*?(&|#|$)");
        if (param.search(pattern) >= 0) {
            return param.replace(pattern, "$1" + value + "$2");
        }
        param = param.replace(/[?#]$/, "");
        return param + (param.indexOf("?") >= 0 ? "&" : "?") + name + "=" + value;

    },

    // add parameter.
    // #region
    addParameter: function (param, args) {

        var a = args.split("&");
        for (var i = 0; i < a.length; i++) {
            if (a[i].split("=").length != 2) continue;
            var name = a[i].split("=")[0];
            var value = a[i].split("=")[1];
            param = gw_com_api.setParameter(param, name, value);
        }
        return param;

    },

    // format number.
    //#region
    prefixNumber: function (value, length, mask, repeat) {

        value = '' + value;
        var len = value.length;
        var repeat = ((repeat != undefined) ? repeat : "0");
        for (var i = 0; i < length - len; i++) {
            value = repeat + value;
        }
        return ((mask != undefined) ? mask : "") + value;

    },
    //#endregion

    // mask. (value)
    //#region
    Mask: function (target, mask, seperator) {

        switch (mask) {
            case "date-ym":
                {
                    var value = target.split("-");
                    if (value.length > 1) return target;
                    var format = target.substr(0, 4) + "-";
                    format = format + target.substr(4, 2);
                    return format;
                };
            case "date-ymd":
                {
                    var value = target.split("-");
                    if (target == "" || value.length > 1) return target;
                    var format = target.substr(0, 4) + "-";
                    format = format + target.substr(4, 2) + "-";
                    format = format + target.substr(6, 2);
                    return format;
                };
            case "time-hh":
                {
                    var format = (target != "") ? target + "시" : target;
                    return format;
                };
            case "time-hm":
                {
                    var value = target.split(":");
                    if (value.length > 1) return target;
                    var format = target.substr(0, 2) + ":";
                    format = format + target.substr(2, 2);
                    return format;
                };
            case "biz-no":
                {
                    var value = target.split("-");
                    if (value.length > 1) return target;
                    var format = target.substr(0, 3) + "-";
                    format = format + target.substr(3, 2) + "-";
                    format = format + target.substr(5, 5);
                    return format;
                };
            case "person-id":
                {
                    var value = target.split("-");
                    if (value.length > 1) return target;
                    var format = target.substr(0, 6) + "-";
                    format = format + target.substr(6, 7);
                    return format;
                };
            case "currency-ko":
                {
                    var el = document.createElement("input");
                    el.type = "text";
                    el.value = target;
                    $(el).formatCurrency({ colorize: true, region: 'ko-KR' });
                    return $(el).val();
                };
            case "numeric-int":
            case "currency-int":
                {
                    var el = document.createElement("input");
                    el.type = "text";
                    el.value = target;
                    $(el).formatCurrency({ colorize: true, region: 'int' });
                    return $(el).val();
                    /*
                    function commify(n) {
                    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
                    n += '';                          // 숫자를 문자열로 변환

                    while (reg.test(n))
                    n = n.replace(reg, '$1' + ',' + '$2');

                    return n;
                    }
                    */
                };
            case "numeric-float":
            case "currency-none":
            case "currency-float":
                {
                    var el = document.createElement("input");
                    el.type = "text";
                    el.value = target;
                    $(el).formatCurrency({ colorize: true, region: 'float' });
                    return $(el).val();
                };
            case "numeric-float1":
                {
                    var el = document.createElement("input");
                    el.type = "text";
                    el.value = target;
                    $(el).formatCurrency({ colorize: true, region: 'float1' });
                    return $(el).val();
                };
            case "numeric-float4":
                {
                    var el = document.createElement("input");
                    el.type = "text";
                    el.value = target;
                    $(el).formatCurrency({ colorize: true, region: 'float4' });
                    return $(el).val();
                };
            default:
                return target;
        }

    },
    //endregion

    // unmask. (value)
    //#region
    unMask: function (target, mask) {

        switch (mask) {
            case "date-ym":
            case "date-ymd":
            case "biz-no":
            case "person-id":
                {
                    var cellvalue = target.replace(/\_/g, "");
                    var value = cellvalue.split("-");
                    return value.join("");
                    //var format = "";
                    //$.each(value, function (i) {
                    //    format = format + ((this != "_") ? this : "");
                    //});
                    //return format;
                }
            case "time-hh":
                {
                    var format = target.replace(/\_/g, "").replace("시", "");
                    return format;
                }
            case "time-hm":
                {
                    var cellvalue = target.replace(/\_/g, "");
                    var value = cellvalue.split(":");
                    return value.join("");
                    //var format = "";
                    //$.each(value, function (i) {
                    //    format = format + ((this != "_") ? this : "");
                    //});
                    //return format;
                }
            case "numeric-int":
            case "currency-int":
            case "numeric-float":
            case "numeric-float1":
            case "numeric-float4":
            case "currency-none":
            case "currency-float":
                {
                    target = "" + target;
                    return target.replace(/\,/g, "");
                }
                break;
            default:
                return target;
        }

    },
    //endregion

    // mask. (text)
    //#region
    formatData: function (element) {

        switch ($(element).attr("mask")) {
            case "currency-ko":
                {
                    $(element).formatCurrency({ colorize: true, region: 'ko-KR' });
                }
                break;
            case "numeric-int":
            case "currency-int":
                {
                    $(element).formatCurrency({ colorize: true, region: 'int' });
                }
                break;
            case "numeric-float":
            case "currency-none":
            case "currency-float":
                {
                    $(element).formatCurrency({ colorize: true, region: 'float' });
                }
                break;
            case "numeric-float1":
                {
                    $(element).formatCurrency({ colorize: true, region: 'float1' });
                }
            case "numeric-float4":
                {
                    $(element).formatCurrency({ colorize: true, region: 'float4' });
                }
                break;
        }

    },
    //endregion

    // unmask. (text)
    //#region
    unformatData: function (element) {

        switch ($(element).attr("mask")) {
            case "date-ym":
            case "date-ymd":
            case "biz-no":
            case "person-id":
                {
                    var cellvalue = $(element).val().replace(/\_/g, "");
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
                    var format = $(element).val().replace(/\_/g, "").replace("시", "");
                    return format;
                }
            case "time-hm":
                {
                    var cellvalue = $(element).val().replace(/\_/g, "");
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
                    return $(element).asNumber({ parseType: 'Int' });
                }
                break;
            case "numeric-float":
            case "numeric-float1":
            case "numeric-float4":
            case "currency-none":
            case "currency-float":
                {
                    return $(element).asNumber({ parseType: 'float' });
                }
                break;
            default:
                return $(element).val();
        }

    },
    //endregion

    // filter select box.
    // #region
    filterSelect: function (id, row, name, rule, grid, trans) {

        if (grid) {
            var obj = "#" + id + "_data";
            if (row == "selected")
                row = $(obj).jqGrid('getGridParam', 'selrow');
            var target = "#" + id + "_form :input[id='" + row + "_" + name + "']";
            if ($(target).length <= 0)
                return;
            var filter = [];
            if (rule.key != undefined) {
                $.each(rule.key, function (j) {
                    filter.push($(obj + "_form :input[id='" + row + "_" + this + "']").val());
                });
            }
            else if (rule.by != undefined) {
                $.each(rule.by, function (j) {
                    filter.push(
                        (this.source != undefined)
                            ? gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid)
                            : $(obj + "_form :input[id='" + row + "_" + this.key + "']").val()
                    );
                });
            }
            else {
                $.each(rule.value, function (j) {
                    filter.push(this);
                });
            }
            var param = {
                name: rule.memory,
                key: filter
            };
            data = gw_com_module.selectGet(param);
            var value = $(target).val();
            $(target + " option").remove();
            if (rule.unshift != undefined) {
                $.each(rule.unshift, function (j) {
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
            if (rule.push != undefined) {
                $.each(rule.push, function (j) {
                    if ($.browser.msie)
                        $(target)[0].add(new Option(this.title, this.value));
                    else
                        $(target)[0].add(new Option(this.title, this.value), null);
                });
            }
            if (trans)
                $(target).jqTransRelist();
            $(target).val(value);
            $(target).change();
        }
        else {
            var obj = "#" + id;
            var target = "#" + id + "_" + name;
            if ($(target).length <= 0)
                return;
            var filter = [];
            if (rule.key != undefined) {
                $.each(rule.key, function (j) {
                    filter.push($(obj + "_" + this).val());
                });
            }
            else if (rule.by != undefined) {
                $.each(rule.by, function (j) {
                    filter.push(
                        (this.source != undefined)
                            ? gw_com_api.getValue(this.source.id, this.source.row, this.source.key, this.source.grid)
                            : $(obj + "_" + this.key).val()
                    );
                });
            }
            else {
                $.each(rule.value, function (j) {
                    filter.push(this);
                });
            }
            var param = {
                name: rule.memory,
                key: filter
            };
            data = gw_com_module.selectGet(param);
            var value = $(target).val();
            $(target + " option").remove();
            if (rule.unshift != undefined) {
                $.each(rule.unshift, function (j) {
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
            if (rule.push != undefined) {
                $.each(rule.push, function (j) {
                    if ($.browser.msie)
                        $(target)[0].add(new Option(this.title, this.value));
                    else
                        $(target)[0].add(new Option(this.title, this.value), null);
                });
            }
            if (trans)
                $(target).jqTransRelist();
            $(target).val(value);
            $(target).change();
        }
    },

    // get row ids. (grid)
    // #region
    getRowIDs: function (id) {

        return $("#" + id + "_data").getDataIDs();

    },
    //#endregion

    // get row data. (grid)
    // #region
    getRowData: function (id, row) {

        if (row == "selected") {
            row = $("#" + id + "_data").jqGrid('getGridParam', 'selrow');
        }
        return $("#" + id + "_data").jqGrid('getRowData', row);

    },
    //#endregion

    // get last row. (grid)
    // #region
    getLastRow: function (id) {

        var ids = $("#" + id + "_data").getDataIDs();
        return (ids.length <= 0) ? 0 : parseInt(ids[ids.length - 1]);

    },
    //#endregion

	// get row no by column value
    getFindRow: function (id, col, val) {
        //var row = -1;
        //$.each(this.getRowIDs(id), function () {
        //    if (val == gw_com_api.getValue(id, this, col, true, false)) {
        //        row = this;
        //        return false;
        //    }
        //});
        //return row;
		var i = 1, nRowCnt = this.getRowCount(id);
		if (nRowCnt < 1) return -1;
		
        for (i; i <= nRowCnt; i++) {
			var sCurVal = this.getValue(id, i, col, true, false);
			if (sCurVal == val) return i;
		}
		return -1;
	},

    // get row count. (grid)
    // #region
    getRowCount: function (id) {

        return $("#" + id + "_data").getGridParam('reccount');

    },
    //#endregion

    // get column count. (grid)
    // #region
    getColCount: function (id) {

        return $("#" + id + "_data").getGridParam('colModel').length;

    },
    //#endregion

    // convert column name to index. (grid)
    // #region
    getColNumber: function (id, name) {

        var model = $("#" + id + "_data").getGridParam('colModel');
        var i = 0, index = 0, title;
        while (i < model.length) {
            title = model[i].name; i++;
            if (title === name)
                return index;
            else if (title !== 'rn' && title !== 'cb' && title !== 'subgrid')
                index++;
        }
        return -1;

    },
    //#endregion

    // get column name by index. (grid)
    // #region
    getColName: function (id, index) {

        var model = $("#" + id + "_data").getGridParam('colModel');
        return model[index].name;

    },
    //#endregion

    // show columns. (grid)
    // #region
    showCols: function (id, cols) {

        $("#" + id + "_data").showCol(cols);

    },
    //#endregion

    // hide columns. (grid)
    // #region
    hideCols: function (id, cols) {

        $("#" + id + "_data").hideCol(cols);

    },
    //#endregion

    // get selected rows. (grid)
    // #region
    getSelectedRow: function (id, multi) {

        if (multi)
            return $("#" + id + "_data").jqGrid('getGridParam', 'selarrrow');
        else
            return $("#" + id + "_data").jqGrid('getGridParam', 'selrow');

    },
    //#endregion

    // select row. (grid)
    // #region
    selectRow: function (id, row, onselect, onbefore) {

        if (row == "reset")
            $("#" + id + "_data").resetSelection();
        else
            $("#" + id + "_data").setSelection(row, (onselect != undefined) ? onselect : true, (onbefore != undefined) ? onbefore : true)

    },
    //#endregion

    // select tab. (tab)
    // #region
    selectTab: function (id, index) {

        return $("#" + id).tabs('select', index - 1);

    },
    //#endregion

    // set title. (tab)
    // #region
    titleTab: function (id, index, title) {

        var tabs = $("#" + id + " .ui-tabs-nav li");
        $(tabs[index - 1]).find("a").text(title);

    },
    //#endregion

    // enable tab. (tab)
    // #region
    enableTab: function (id, index) {

        return $("#" + id).tabs('enable', index - 1);

    },
    //#endregion

    // disable tab. (tab)
    // #region
    disableTab: function (id, index) {

        return $("#" + id).tabs('disable', index - 1);

    },
    //#endregion

    // get input type.
    // #region
    getInputType: function (id, row, element, isgrid) {

        if (element != undefined) {
            if (isgrid) {
            }
            else {
                var obj = "#" + id + "_" + element;
                return $(obj).attr("type");
            }
        }
        else
            return $("#" + id).attr("type");

    },
    //#endregion

    // get value.
    // #region
    getValue: function (id, row, element, isgrid, isformat) {

        if (element != undefined) {
            if (isgrid) {
                var obj = "#" + id + "_data";
                if (row == "selected")
                    row = $(obj).jqGrid('getGridParam', 'selrow');
                if (row == null || row == undefined) return "";
                if (($("#" + id).attr("sheet")
                        && ($("#" + id).attr("row") != row || $("#" + id).attr("cell") != element))
                    || gw_com_module.v_Object[id].option[element] == undefined
					|| gw_com_module.v_Object[id].option[element].edit == false
					|| (!$("#" + id).attr("sheet") && $(obj).jqGrid('getCell', row, "_CRUD") == "R")) {
                    switch (gw_com_module.v_Object[id].option[element].format) {
                        case "select":
                        case "checkbox":
                            {
                                var el = document.createElement("div");
                                $(el).html($(obj).jqGrid('getCell', row, element));
                                return $(el).find("input").val();
                            }
                            break;
                        case "link":
                            {
                                var el = document.createElement("div");
                                $(el).html($(obj).jqGrid('getCell', row, element));
                                return $(el).text();
                            }
                            break;
                        default:

                            return gw_com_api.unMask($(obj).jqGrid('getCell', row, element), gw_com_module.v_Object[id].option[element].mask);
                    }
                }
                else {
                    var value = "";
                    switch (gw_com_module.v_Object[id].option[element].edit) {
                        case "radio":
                            {
                                var el = $(obj + " :radio[name=" + row + "_" + element + "]");
                                $.each(el, function () {
                                    if ($(this).attr("checked")) value = $(this).val();
                                });
                            }
                            break;
                        default:
                            {
                                var el = $(obj + " :input[id=" + row + "_" + element + "]");
                                value = ($(el).attr("mask") != undefined)
                                            ? gw_com_api.unformatData(el) : $(el).val();
                                //value = gw_com_api.unMask($(el).val(), gw_com_module.v_Object[id].option[element].mask);
                            }
                            break;
                    }
                    return value;
                }
            }
            else {
                //var obj = "#" + id + "_" + element + ((isformat) ? "_view" : "");
                var obj = "#" + id + "_" + element;
                if (isformat || (!$(obj).hasClass(id + "_editchangable") && $(obj + "_view").length))
                    obj += "_view";

                var value = null;
                switch ($(obj).attr("type")) {
                    case "checkbox":
                        {
                            value = $(obj).attr("checked")
								? $(obj).attr("onval")
								: $(obj).attr("offval");
                        }
                        break;
                    case "radio":
                        {
                            var radio = $(targetobj + " :radio[name='" + $(obj).attr("name") + "']");
                            $.each(radio, function () {
                                if (this.checked)
                                    value = this.value;
                            });
                        }
                        break;
                    case "html":
                        {
                            value = $(obj).html();
                        }
                        break;
                    case "hidden":
                        {
                            var control =
                                gw_com_module.v_Control[$(obj).attr("control")];
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
                                value = $(obj).val();
                        }
                        break;
                    default:
                        {
                            if ($(obj).attr("mask") != undefined) {
                                var param = {
                                    targetobj: obj
                                };
                                value = gw_com_module.textunMask(param);
                            }
                            else
                                value = $(obj).val();
                        }
                        break;
                }
                return value;
            }
        }
        else
            return $("#" + id).val();

    },
    //#endregion

    // set value.
    // #region
    setValue: function (id, row, element, value, isgrid, ishide, ischange) {

        if (element != undefined) {
            if (isgrid) {
                var obj = "#" + id + "_data";
                if (row == "selected")
                    row = $(obj).jqGrid('getGridParam', 'selrow');
                if (($("#" + id).attr("sheet")
                        && ($("#" + id).attr("row") != row || $("#" + id).attr("cell") != element))
                    || gw_com_module.v_Object[id].option[element] == undefined
				    || gw_com_module.v_Object[id].option[element].edit == false
					|| (!$("#" + id).attr("sheet") && $(obj).jqGrid('getCell', row, "_CRUD") == "R")) {
                    $(obj).jqGrid('setCell', row, element, "" + value);
                }
                else {
                    var el = obj + " :input[id=" + row + "_" + element + "]";
                    $(el).val(value);
                    (ischange != false) ? $(el).change() : $(el).blur();
                    if (ishide
                        && gw_com_module.v_Object[id].option[element] != undefined
                        && (gw_com_module.v_Object[id].option[element].edit == "save"
                            || gw_com_module.v_Object[id].option[element].edit == "hidden")) {
                        var content =
                            this.Mask(value, $(el).attr("mask")) +
                            "<input" +
                            " type='hidden'" +
                            " id='" + $(el).attr("id") + "'" +
                            " name='" + $(el).attr("name") + "'" +
                            " value='" + value + "'";
                        if ($(el).attr("display"))
                            content = content +
                                " display=true";
                        if ($(el).attr("mask") != undefined)
                            content = content +
                                " mask='" + $(el).attr("mask") + "'";
                        content = content +
                            " />";
                        $(el).parent().html(content);
                    }
                    /*
                    else if (gw_com_module.v_Object[id].option[element].edit == "checkbox") {
                    $(el).attr("checked", true);
                    }
                    */
                    else if (gw_com_module.v_Object[id].option[element].edit == "checkbox") {
                        $(el).attr("checked", $(el).attr("onval") == value ? true : false);
                        ($(el).hasClass(id + "_editchangable") && ischange != false) ? $(el).change() : $(el).blur();
                    } else if (gw_com_module.v_Object[id].option[element].edit == "radio") {
                        var radio = $(obj + " :radio[name=" + row + "_" + element + "]");
                        $.each(radio, function () {
                            $(this).attr("checked", ($(this).val() == value));
                        });
                        ($(el).hasClass(id + "_editchangable") && ischange != false) ? $(el).change() : $(el).blur();
                    }
                }
            }
            else {
                var obj = "#" + id + "_" + element;
                switch ($(obj).attr("type")) {
                    case "html":
                        {
                            $(obj).html(value);
                        }
                        break;
                    case "hidden":
                        {
                            var control =
                                gw_com_module.v_Control[$(obj).attr("control")];
                            if (control != undefined) {
                                switch (control.by) {
                                    case "DX":
                                        {
                                            switch (control.type) {
                                                case "htmleditor":
                                                    {
                                                        control.id.SetHtml(value);
                                                    }
                                                    break;
                                            }
                                        }
                                        break;
                                }
                            }
                            else {
                                $(obj).val(value);
                                ($(obj).hasClass(id + "_editchangable") && ischange != false) ? $(obj).change() : $(obj).blur();
                            }
                        }
                        break;
                    case "checkbox":
                        {
                            $(obj).val(gw_com_api.Mask(value, $(obj).attr("mask")));
                            if (ishide) {
                                var mask = $(obj + "_view").attr("mask");
                                mask = (mask == undefined) ? $(obj).attr("mask") : mask;
                                $(obj + "_view").val(gw_com_api.Mask(value, mask));
                            }
                            $(obj).attr("checked", ($(obj).attr("onval") == value) ? true : false);
                            ($(obj).hasClass(id + "_editchangable") && ischange != false) ? $(obj).change() : $(obj).blur();
                        }
                        break;
                    case "select":
                    case "select-one":
                        {
                            $(obj).val(gw_com_api.Mask(value, $(obj).attr("mask")));
                            if (ishide) {
                                var mask = $(obj + "_view").attr("mask");
                                mask = (mask == undefined) ? $(obj).attr("mask") : mask;
                                $(obj + "_view").val($(obj + " :selected").text());
                            }
                            var $wrapper = $(obj).parent();
                            var $ul = $("ul:eq(0)", $wrapper);
                            $('a:eq(' + $(obj + " :selected").index() + ')', $ul).click();
                            ($(obj).hasClass(id + "_editchangable") && ischange != false) ? $(obj).change() : $(obj).blur();
                        }
                        break;
                    default:
                        {
                            /*
                            var mask = $(obj).attr("mask");
                            if (obj != undefined) {
                            $(obj).val(gw_com_api.Mask(value, mask));
                            //if (ishide) 
                            //$(obj + "_view").val(gw_com_api.Mask(value, mask));
                            }
                            else {
                            $(obj).val(value);
                            //if (ishide)
                            //$(obj + "_view").val(value);
                            }
                            */
                            $(obj).val(gw_com_api.Mask(value, $(obj).attr("mask")));
                            if (ishide) {
                                var mask = $(obj + "_view").attr("mask");
                                mask = (mask == undefined) ? $(obj).attr("mask") : mask;
                                $(obj + "_view").val(gw_com_api.Mask(value, mask));
                            }
                            ($(obj).hasClass(id + "_editchangable") && ischange != false) ? $(obj).change() : $(obj).blur();
                        }
                        break;
                }
            }
        }
        else
            $("#" + id).val(value);

    },
    //#endregion

    // get cell value.
    // #region
    getCellValue: function (type, id, row, name) {

        return this.getValue(id, row, name, (type == "GRID") ? true : false);

    },
    //#endregion

    // set cell value.
    // #region
    setCellValue: function (type, id, row, name, value) {

        this.setValue(id, row, name, value, (type == "GRID") ? true : false);

    },
    //#endregion

    // clear value.
    // #region
    clearValue: function (id, row, element, isgrid, ishide) {

        this.setValue(id, row, element, ((ishide) ? " " : ""), true);
    },
    //#endregion

    // get text.
    // #region
    getText: function (id, row, element, isgrid) {

        if (element != undefined) {
            if (isgrid) {
                var obj = "#" + id + "_data";
                if (row == "selected")
                    row = $(obj).jqGrid('getGridParam', 'selrow');
                if (($("#" + id).attr("sheet")
                        && ($("#" + id).attr("row") != row || $("#" + id).attr("cell") != element))
                    || gw_com_module.v_Object[id].option[element] == undefined
					|| gw_com_module.v_Object[id].option[element].edit == false
					|| (!$("#" + id).attr("sheet") && $(obj).jqGrid('getCell', row, "_CRUD") == "R")) {
                }
                else {
                    var el = $(obj + " :input[id=" + row + "_" + element + "]" + " :selected");
                    return $(el).text();
                }
            }
            else {
                var obj = "#" + id + "_" + element;
                switch ($(obj).attr("type")) {
                    case "checkbox":
                        return ($(obj).attr("checked")) ? $(obj).attr("text") : "";
                    case "radio":
                        {
                            var text = "";
                            var el = $("#" + id + " :radio[name='" + this.name + "']");
                            $.each(el, function () {
                                if (this.checked)
                                    text = $(this).attr("text");
                            });
                            return text;
                        }
                    case "select":
                    case "select-one":
                        {
                            var el = $(obj + " :selected");
                            return (el != undefined) ? (el).text() : "";
                        }
                    default:
                        return $(obj).val();
                }
            }
        }
        else
            return $("#" + id).text();

    },
    //#endregion

    // get attribute.
    // #region
    getAttribute: function (id, name, row, element, isgrid) {

        if (element != undefined) {
            if (isgrid) {
            }
            else {
                var obj = "#" + id + "_" + element;
                switch ($(obj).attr("type")) {
                    case "radio":
                        return $(obj + "_1").attribute(name);
                    default:
                        return $(obj).attr(name);
                }
            }
        }
        else
            return $("#" + id).attr(name);

    },
    //#endregion

    // set attribute.
    // #region
    setAttribute: function (id, row, element, name, value, isgrid) {

        var obj = "#" + id;
        if (element != undefined) {
            if (isgrid)
                obj = obj + "_data" + " :input[id=" + row + "_" + element + "]";
            else
                obj = obj + "_" + element;
        }
        if (name == "visible") {
            (value) ? $(obj).show() : $(obj).hide();
        }
        else
            $(obj).attr(name, value);

    },
    //#endregion

    // set caption.
    // #region
    setCaption: function (id, title, isgrid) {

        if (isgrid) {
            $("#" + id + "_data").setCaption(title);
        }
        else
            $("#" + id + "_caption").text(title);

        //Ref
        //var ele = $("#grdData_모델").find("span.ui-jqgrid-title");
        //$(ele)[0].firstChild.data = "◈ 변경 Logic";
        // FORM의 경우 : $("#" + param.targetid + "_caption");
    },
    //#endregion

    // set error.
    // #region
    setError: function (error, id, row, element, isgrid, istrans) {

        if (isgrid) {
            var obj = "#" + id + "_data";
            var el = obj + " :input[id=" + row + "_" + element + "]";
            if (error) {
                $(el).addClass("error_highlight");
            } else {
                $(el).removeClass("error_highlight")
            }
        }
        else {
            var obj = "#" + id;
            var el = obj + "_" + element;
            if ($(el).attr("radio")) {
                var radio = $(obj + " :radio[name='" + $(el).attr("name") + "']");
                $.each(radio, function () {
                    if (istrans) {
                        var $wrapper = $(this).parent().parent().parent();
                        (error)
                            ? $wrapper.addClass("jqTransformInputWrapper_error")
                            : $wrapper.removeClass("jqTransformInputWrapper_error");
                    }
                    else
                        (error)
                            ? $(this).addClass("error_highlight") : $(this).removeClass("error_highlight");
                });
            }
            else {
                if (istrans) {
                    var $wrapper = $(el).parent().parent().parent();
                    (error)
                        ? $wrapper.addClass("jqTransformInputWrapper_error")
                        : $wrapper.removeClass("jqTransformInputWrapper_error");
                }
                else
                    (error)
                        ? $(el).addClass("error_highlight") : $(el).removeClass("error_highlight");
            }
        }

    },
    //#endregion

    // get CRUD status.
    // #region
    getCRUD: function (id, row, isgrid) {

        switch (this.getDataStatus(id, row, isgrid)) {
            case "I": return "initialize";
            case "C": return "create";
            case "R": return "retrieve"
            case "U": return "update";
            default: return "none";
        }

    },
    //#endregion

    // set CRUD status.
    // #region
    setCRUD: function (id, row, crud, isgrid) {

        this.setDataStatus(id, row, crud, isgrid);

    },
    //#endregion

    // get data status.
    // #region
    getDataStatus: function (id, row, isgrid) {

        if (isgrid) {
            var obj = "#" + id + "_data";
            if (row == "selected")
                row = $(obj).jqGrid('getGridParam', 'selrow');
            return $(obj + " :input[id=" + row + "__CRUD]").val();
            /*
            if (gw_com_module.v_Object[id].option[element] == undefined
            || gw_com_module.v_Object[id].option[element].edit == false
            || $(obj).jqGrid('getCell', row, "_CRUD") == "R") {
            switch (gw_com_module.v_Object[id].option[element].format) {
            case "select":
            {
            var el = document.createElement("div");
            $(el).html($(obj).jqGrid('getCell', row, element));
            return $(el).find("input").val();
            }
            default:
            return $(obj).jqGrid('getCell', row, element);
            }
            }
            else {
            //switch (gw_com_module.v_Object[id].option[element].edit) {
            //}
                
            }
            */
        }
        else {
            var obj = "#" + id + "_CRUD";
            return $(obj).val();
        }

    },
    //#endregion

    // set data status.
    // #region
    setDataStatus: function (id, row, crud, isgrid) {

        var value = "";
        switch (crud) {
            case "retrieve":
                value = "R";
                break;
            case "create":
                value = "C";
                break;
            case "modify":
                value = "U";
                break;
            case "remove":
                value = "D";
                break;
        }
        if (isgrid) {
            var obj = "#" + id + "_form";
            $(obj + " :input[id=" + row + "__CRUD]").val(value)
        }
        else
            $("#" + id + "_CRUD").val(value);

    },
    //#endregion

    // get updatable.
    // #region
    getUpdatable: function (id, isgrid) {

        if (gw_com_module.v_Object[id].buffer.remove.length > 0)
            return true;
        if (isgrid) {
            var ids = this.getRowIDs(id);
            var obj = "#" + id + "_data";
            for (var id = 0; id < ids.length; id++) {
                var crud = $(obj + " :input[id=" + ids[id] + "__CRUD]").val();
                if (crud == "C" || crud == "U")
                    return true;
            }
        }
        else {
            var obj = "#" + id + "_CRUD";
            var crud = $(obj).val();
            if (crud == "C" || crud == "U")
                return true;
        }
        return false;

    },
    //#endregion

    // set updatable.
    // #region
    setUpdatable: function (id, row, isgrid) {

        if (isgrid) {
            var obj = "#" + id + "_form";
            var crud = $(obj + " :input[id=" + row + "__CRUD]").val();
            $(obj + " :input[id=" + row + "__CRUD]").val((crud == "I") ? "C" : (crud == "R") ? "U" : crud);
        }
        else {
            var crud = $("#" + id + "_CRUD").val();
            $("#" + id + "_CRUD").val((crud == "I") ? "C" : (crud == "R") ? "U" : crud);
        }

    },
    //#endregion

    // set height. (grid)
    // #region
    setHeight: function (id, height, isgrid) {

        if (isgrid)
            $("#" + id + "_data").jqGrid('setGridHeight', height);

    },
    //#endregion

    // set focus.
    // #region
    setFocus: function (id, row, element, isgrid) {

        if (element != undefined
            && element != "_self") {
            if (isgrid) {
                var obj = "#" + id + "_data";
                if (row == "selected")
                    row = $(obj).jqGrid('getGridParam', 'selrow');
                if (gw_com_module.v_Object[id].option[element] == undefined
					|| gw_com_module.v_Object[id].option[element].edit == false
					|| $(obj).jqGrid('getCell', row, "_CRUD") == "R") {
                }
                else {
                    var el = $(obj + " :input[id=" + row + "_" + element + "]");
                    ($(el).attr("type") == "text" || $(el).attr("type") == "textarea")
                        ? $(el).select() : $(el).focus();
                }
            }
            else {
                var obj = "#" + id + "_" + element;
                switch ($(obj).attr("type")) {
                    case "text":
                    case "textarea":
                        {
                            $(obj).select();
                        }
                        break;
                    case "hidden":
                        {
                            var control =
                                gw_com_module.v_Control[$(obj).attr("control")];
                            if (control != undefined) {
                                switch (control.by) {
                                    case "DX":
                                        {
                                            switch (control.type) {
                                                case "htmleditor":
                                                    {
                                                        control.id.SetFocus();
                                                    }
                                                    break;
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    default:
                        {
                            $(obj).focus();
                        }
                        break;
                }
            }
        }
        else
            ((isgrid) ? $("#" + id + "_data") : $("#" + id)).focus();

    },
    //#endregion


    // show.
    //#region
    show: function (id, element, isgrid) {

        if (element != undefined) {
            if (isgrid) {
                this.showCols(id, element);
                gw_com_module.objResize({ target: [{ type: "GRID", id: id }] });
            }
            else {
                var obj = "#" + id + "_" + element;
                switch ($(obj).attr("type")) {
                    case "hidden":
                        {
                            var control =
                                gw_com_module.v_Control[$(obj).attr("control")];
                            if (control != undefined) {
                                switch (control.by) {
                                    case "DX":
                                        {
                                            switch (control.type) {
                                                case "htmleditor":
                                                    {
                                                        control.id.SetVisible(true);
                                                    }
                                                    break;
                                            }
                                        }
                                        break;
                                }
                            }
                            else
                                $(obj).show();
                        }
                        break;
                    default:
                        {
                            $(obj).show();
                        }
                        break;
                }
            }
        }
        else
            $("#" + id).show();

    },
    //#endregion

    // hide.
    //#region
    hide: function (id, element, isgrid) {

        if (element != undefined) {
            if (isgrid) {
                this.hideCols(id, element);
                gw_com_module.objResize({ target: [{ type: "GRID", id: id }] });
            }
            else {
                var obj = "#" + id + "_" + element;
                switch ($(obj).attr("type")) {
                    case "hidden":
                        {
                            var control =
                                gw_com_module.v_Control[$(obj).attr("control")];
                            if (control != undefined) {
                                switch (control.by) {
                                    case "DX":
                                        {
                                            switch (control.type) {
                                                case "htmleditor":
                                                    {
                                                        control.id.SetVisible(true);
                                                    }
                                                    break;
                                            }
                                        }
                                        break;
                                }
                            }
                            else
                                $(obj).hide();
                        }
                        break;
                    default:
                        {
                            $(obj).hide();
                        }
                        break;
                }
            }
        }
        else
            $("#" + id).hide();

    },
    //#endregion

    // show.
    //#region
    showObject: function (id, element, isgrid) {

        this.show(id, element, isgrid);

    },
    //#endregion

    // hide.
    //#region
    hideObject: function (id, element, isgrid) {

        this.hide(id, element, isgrid);

    },
    //#endregion

    // enable.
    // #region
    enable: function (id, element, row, isgrid) {

        if (element != undefined) {
            if (isgrid) {
                var obj = "#" + id + "_data";
                $(obj + " :input[id=" + row + "_" + element + "]").attr("disabled", false);
            }
            else
                $("#" + id + "_" + element).attr("disabled", false);
        }
        else
            $("#" + id).attr("disabled", false);

    },
    //#endregion

    // disable.
    // #region
    disable: function (id, element, row, isgrid) {

        if (element != undefined) {
            if (isgrid) {
                var obj = "#" + id + "_data";
                $(obj + " :input[id=" + row + "_" + element + "]").attr("disabled", true);
            }
            else {
                $("#" + id + "_" + element).attr("disabled", true);
            }
        }
        else
            $("#" + id).attr("disabled", true);

    },
    //#endregion

    // block.
    //#region
    block: function (id) {

        if (id != undefined)
            $("#" + id).block();
        else
            $.blockUI();

    },
    //#endregion

    // unblock.
    //#region
    unblock: function (id) {

        if (id != undefined)
            $("#" + id).unblock();
        else
            $.unblockUI();

    },
    //#endregion

    // remove.
    //#region
    remove: function (id) {

        $("#" + id).remove();

    },
    //#endregion

    // fontcheck
    //#region
    fontcheck: function(font) {
        var test_string = 'mmmmmmmmmwwwwwww';
        var test_font = '"Comic Sans MS"';
        var notInstalledWidth = 0;
        var testbed = null;
        var guid = 0;
        font = '"' + font + '"';

        if (!$('#fontInstalledTest').length) {
            $('head').append('<' + 'style> #fontInstalledTest, #fontTestBed { position: absolute; left: -9999px; top: 0; visibility: hidden; } #fontInstalledTest { font-size: 50px!important; font-family: ' + test_font + ';}</' + 'style>');
            $('body').append('<div id="fontTestBed"></div>').append('<span id="fontInstalledTest" class="fonttest">' + test_string + '</span>');
        }
        testbed = $('#fontTestBed');
        notInstalledWidth = $('#fontInstalledTest').width();

        guid++;

        var style = '<' + 'style id="fonttestStyle"> #fonttest' + guid + ' { font-size: 50px!important; font-family: ' + font + ', ' + test_font + '; } <' + '/style>';

        $('head').find('#fonttestStyle').remove().end().append(style);
        testbed.empty().append('<span id="fonttest' + guid + '" class="fonttest">' + test_string + '</span>');

        return (testbed.find('span').width() != notInstalledWidth);
    },
    //#endretion

    // get current date.
    // #region
    getYear: function () {

        return this.getTime().substr(0, 4);

    },
    getMonth: function () {


        return this.getTime().substr(4, 2);

    },
    getDay: function () {

        return this.getTime().substr(6, 2);

    },
    getYM: function (seperator, offset) {

        var date = this.getTime(offset);
        seperator = (seperator == undefined) ? "" : seperator;
        return "" +
            date.substr(0, 4) + seperator +
            date.substr(4, 2) + seperator;

    },
    getDate: function (seperator, offset) {

        var date = this.getTime(offset);
        seperator = (seperator == undefined) ? "" : seperator;
        return "" +
            date.substr(0, 4) + seperator +
            date.substr(4, 2) + seperator +
            date.substr(6, 2);

    },
    getNow: function (seperator, offset) {

        var date = this.getTime(offset);
        seperator = (seperator == undefined) ? "" : seperator;
        return "" +
            date.substr(8, 2) + seperator +
            date.substr(10, 2);

    },
    getTime: function (offset) {

        return this.toTimeString(new Date(), offset);

    },
    toTimeString: function (date, offset) {

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        if (offset != undefined) {
            if (offset.day != undefined) {
                date.setDate(date.getDate() + offset.day);
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
            }
            if (offset.month != undefined) {
                date.setMonth(date.getMonth() + offset.month);
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
            }
        }
        if (("" + month).length == 1) { month = "0" + month; }
        if (("" + day).length == 1) { day = "0" + day; }
        if (("" + hour).length == 1) { hour = "0" + hour; }
        if (("" + min).length == 1) { min = "0" + min; }

        return ("" + year + month + day + hour + min);

    },
    
    //--------------------------------------------------------------------------
    // 특정 날짜에 대해 지정한 값만큼 가감(+-)한 날짜를 반환
    //--------------------------------------------------------------------------
    // 입력 파라미터
    //		pInterval : "yyyy" 는 연도 가감, "m" 은 월 가감, "d" 는 일 가감
    //		pAddVal  : 가감 하고자 하는 값 (정수형)
    //		pYyyymmdd : 가감의 기준이 되는 날짜
    //		pDelimiter : pYyyymmdd 값에 사용된 구분자를 설정 (없으면 "" 입력) 
    // 반환값
    //		yyyymmdd 또는 함수 입력시 지정된 구분자를 가지는 yyyy?mm?dd 값
    // 사용예
    //		2008-01-01 에 3 일 더하기 ==> addDate("d", 3, "2008-08-01", "-");
    //--------------------------------------------------------------------------
	addDate: function(pInterval, pAddVal, pYyyymmdd, pDelimiter) {
	  
		if (pDelimiter != "") 
			pYyyymmdd = pYyyymmdd.replace(eval("/\\" + pDelimiter + "/g"), "");
	 
		var yyyy = pYyyymmdd.substr(0, 4);
		var mm = pYyyymmdd.substr(4, 2);
		var dd = pYyyymmdd.substr(6, 2);
	  
		if (pInterval == "yyyy") { yyyy = (yyyy * 1) + (pAddVal * 1); } 
		else if (pInterval == "m") { mm  = (mm * 1) + (pAddVal * 1); } 
		else if (pInterval == "d") { dd  = (dd * 1) + (pAddVal * 1); }
	  
	 
		var cDate = new Date(yyyy, mm - 1, dd) // 12월, 31일을 초과하는 입력값에 대해 자동으로 계산된 날짜가 만들어짐.
		var cYear = "", cModth = "", cDay = "";
        cYear = cDate.getFullYear();
		cMonth = cDate.getMonth() + 1;
		cDay = cDate.getDate();
		
		cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
		cDay = cDay < 10 ? "0" + cDay : cDay;
	 
		if (pDelimiter != "") return cYear + pDelimiter + cMonth + pDelimiter + cDay;
		else return cYear + "" + cMonth + "" + cDay;
	  
	 },

    //#endregion

    // show message.
    // #region
    showMessage: function (msg, type) {

        switch (type) {
            case "yesno":
                return confirm(msg);
                break;
            case "nomaster":
                alert("작업할 Master Data가 선택되지 않았습니다.");
                return false;
            case "success":
                alert("정상적으로 처리되었습니다.");
                return false;
            default:
                alert(msg);
                break;
        }

    },
    //#endregion

    // show message.
    // #region
    messageBox: function (msg, width, ID, type, param) {

        var args = {
            ID: gw_com_api.v_Stream.msg_showMessage,
            data: {
                page: this.getPageID(),
                ID: (ID != undefined) ? ID : gw_com_api.v_Message.msg_alert,
                type: (type != undefined) ? type : "ALERT",
                arg: param
            }
        };
        var message = "";
        var w = 420;
        $.each(msg, function () {
            message = message +
                "<div" +
                    " align='" + ((this.align != undefined) ? this.align : "center") + "'" +
                    " style='margin-top:2px;" + ((this.margin != undefined) ? " margin-left:" + this.margin + "px;" : "") + "'" +
                ">";
            switch (this.text) {
                case "SUCCESS":
                    message = message + "정상적으로 처리되었습니다.";
                    break;
                case "ERROR":
                    message = message + "처리 중에 오류가 발생하였습니다.";
                    break;
                case "NOVALIDATE":
                    message = message +
                        "입력하지 않았거나 유효하지 않은 값이 있습니다." +
                        "</div>" +
                        "<div" +
                            " align='" + ((this.align != undefined) ? this.align : "center") + "'" +
                            " style='margin-top:2px;" + ((this.margin != undefined) ? " margin-left:" + this.margin + "px;" : "") + "'" +
                        ">" +
                        "하이라이트된 컬럼의 값을 확인해 주세요.";
                    break;
                case "NOMASTER":
                    message = message + "선택된 마스터 데이터가 없습니다.";
                    break;
                case "NODATA":
                    message = message + "선택된 데이터가 없습니다.";
                    break;
                case "NOPRINT":
                    message = message + "선택된 출력물이 없습니다.";
                    break;
                case "DELETE":
                    message = message +
                        "연관된 하위 데이터가 모두 함께 삭제됩니다." +
                        "</div>" +
                        "<div" +
                            " align='" + ((this.align != undefined) ? this.align : "center") + "'" +
                            " style='margin-top:2px;" + ((this.margin != undefined) ? " margin-left:" + this.margin + "px;" : "") + "'" +
                        ">" +
                        "계속 하시겠습니까?";
                    break;
                case "REMOVE":
                    message = message +
                        "하위 데이터 및 연관 데이터가 모두 함께 삭제됩니다." +
                        "</div>" +
                        "<div" +
                            " align='" + ((this.align != undefined) ? this.align : "center") + "'" +
                            " style='margin-top:2px;" + ((this.margin != undefined) ? " margin-left:" + this.margin + "px;" : "") + "'" +
                        ">" +
                        "계속 하시겠습니까?";
                    break;
                default:
                    message = message + this.text;
                    break;
            }
            message = message +
                "</div>";
        });
        args.data.message = message;
        args.data.width = (width != undefined) ? width : w;
        gw_com_module.streamInterface(args);

    },
    //#endregion

    // launch menu
    // #region
    launchMenu: function(args) {

        if (args == undefined || args.menu_id == undefined) return;

        // Session Check
        var param = {
            request: "PAGE",
            url: "../Service/svc_Session.aspx",
            async: false,
            param: args,
            handler_success: successSession,
            handler_invalid: invalidSession
        };
        gw_com_module.callRequest(param);

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

            var args = this.param;
            var retrieve = false;
            if (args.obj_id == undefined || args.obj_type == undefined)
                retrieve = true;
            if (!retrieve && args.obj_type != "URL" && args.obj_type != "APP" && args.menu_nm == undefined)
                retrieve = true;

            var param = {
                menu_id: args.menu_id,
                obj_id: args.obj_id == undefined ? "" : args.obj_id,
                obj_type: args.obj_type == undefined ? "" : args.obj_type,
                menu_nm: args.menu_nm == undefined ? "" : args.menu_nm,
                menu_args: args.menu_args == undefined ? "" : args.menu_args,
                frame: args.frame == undefined ? false : args.frame,
                add_args: args.add_args == undefined ? "" : args.add_args
            }

            if (retrieve) {
                var args = {
                    request: "DATA",
                    name: "SYS_2040_S_1_1",
                    url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                        "?QRY_ID=SYS_2040_S_1_1" +
                        "&QRY_COLS=obj_id,obj_type,menu_nm,menu_args" +
                        "&CRUD=R" +
                        "&arg_menu_id=" + param.menu_id,
                    async: false,
                    handler_success: successRequest
                };
                gw_com_module.callRequest(args);

                function successRequest(type, name, data) {
                    param.obj_id = data.DATA[0];
                    param.obj_type = data.DATA[1];
                    param.menu_nm = data.DATA[2];
                    param.menu_args = data.DATA[3];
                }
            }

            if (param.obj_id == undefined || param.obj_id == "") return;
            var url = "";
            if (param.obj_type == "URL") {
                url = param.obj_id;
            } else if (param.obj_type == "APP") {
                url = "/" + param.obj_id;
            } else {
                param.menu_args = (gw_com_api.addParameter(param.menu_args, param.add_args) == "" ? "" : "&" + gw_com_api.addParameter(param.menu_args, param.add_args).substr(1));
                if (param.frame)
                    top.gw_job_process.processTab(param.obj_id, param.menu_nm, "../job/" + param.obj_id + ".aspx", param.menu_args, param.menu_id);
                else
                    url = "/";
            }
            if (url != "") {
                url += "?menu_id=" + param.menu_id +
                        "&user_id=" + gw_com_module.v_Session.USR_ID +
                        "&LAUNCH=MAIN";
                url = gw_com_api.addParameter(url, param.menu_args);
                url = gw_com_api.addParameter(url, param.add_args);
                window.open(url, "", "");
            }

            // Log for Open Menu
            var args = {
                url: "COM", nomessage: true, procedure: "sp_zmenu_log", 
                input: [
                    { name: "menu_id", value: param.menu_id, type: "varchar" },
                    { name: "user_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                ]
            };
            gw_com_module.callProcedure(args);

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

    },
    // #endregion

    // getMenuInfo
    // #region
    getMenuInfo: function (args) {

        var rtn;
        var param = {
            request: "DATA",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=SYS_2040_S_1_1" +
                "&QRY_COLS=menu_id,obj_id,obj_type,menu_nm,menu_args" +
                "&CRUD=R" +
                "&arg_menu_id=" + args.menu_id,
            async: false,
            handler_success: successRequest
        };
        gw_com_module.callRequest(param);

        function successRequest(type, name, data) {
            rtn = {
                menu_id: data.DATA[0],
                obj_id: data.DATA[1],
                obj_type: data.DATA[2],
                menu_nm: data.DATA[3],
                menu_args: data.DATA[4]
            };
        }

        return rtn;

    },
    // #endregion

    // postOpen
    // #region
    openWindow: function (args) {

        // for send param
        v_global.event.send_data = args.data;

        // popup window argument
        var url = args.page + ((args.content != undefined) ? "." + args.content : ".aspx") +
                "?NAME=" + args.page +
                "&LAUNCH=POPUP" +
                "&TYPE=" + gw_com_module.v_Current.launch +
                "&PAGE=" + gw_com_module.v_Current.window /*+
                "&USR_ID=" + gw_com_module.v_Session.USR_ID +
                "&USR_NM=" + gw_com_module.v_Session.USR_NM +
                "&GW_ID=" + gw_com_module.v_Session.GW_ID +
                "&EMP_NO=" + gw_com_module.v_Session.EMP_NO +
                "&DEPT_CD=" + gw_com_module.v_Session.DEPT_CD +
                "&DEPT_NM=" + gw_com_module.v_Session.DEPT_NM +
                "&POS_CD=" + gw_com_module.v_Session.POS_CD +
                "&POS_NM=" + gw_com_module.v_Session.POS_NM +
                "&DEPT_AREA=" + gw_com_module.v_Session.DEPT_AREA +
                "&DEPT_AUTH=" + gw_com_module.v_Session.DEPT_AUTH +
                "&USER_TP=" + gw_com_module.v_Session.USER_TP*/

        //if (window.showModalDialog) {
        //    if (option == undefined) {
        //        option = "dialogWidth:800px;dialogHeight:600px;edge:sunken";
        //    }
        //    var rtn = showModalDialog(url, data, option);
        //}
        //else {
            // for similar functionality in Opera, but it's not modal!
            if (args.option == undefined) {
                args.option = "width=800,height=600,left=300,modal=yes,alwaysRaised=yes"
            }

            var win = window.open(url, "", args.option, true);  // for Edge by JJJ at 2021.04.06
            //var win = window.open(url, null, args.option, null);
            win.dialogArguments = args.data;
        //}
    },
    // #endregion

    // setCookie
    // #region
    setCookie: function (args) {

        var today = new Date();
        if (!args.expiredays)
            args.expiredays = -1

        today.setDate(today.getDate() + args.expiredays);
        document.cookie = args.name + "=" + escape(args.value) + "; path=/; expires=" + today.toGMTString() + ";";

    },
    // #endregion

    // getCookie
    // #region
    getCookie: function (args) {

        var cook = document.cookie + ";";
        var idx = cook.indexOf(args.name, 0);
        var val = "";
        if (idx != -1) {
            cook = cook.substring(idx, cook.length);
            begin = cook.indexOf("=", 0) + 1;
            end = cook.indexOf(";", begin);
            val = unescape(cook.substring(begin, end));
        }
        return val;

    },
    // #endregion

    // setHelp
    // #region
    setHelp: function (param) {

        if (param.type == "GRID") {

            var obj = "#" + param.targetid + "_data";
            $.each(param.element, function () {
                var col_id = gw_com_api.getColNumber(param.targetid, this.name);
                if (this.text != "") {

                    var title = $(obj).jqGrid("getGridParam", "colNames")[col_id];
                    var img = "<img src='/Style/images/others/grid_question.png' align='absmiddle' style='vertical-align: middle;'>";
                    //var label = "<div onclick='alert(\"\");'>" + img + " " + title + "</div>";
                    var label = "<div>" + img + " " + title + "</div>";
                    var args = {
                        obj: param.targetid,
                        col: this.name,
                        label: label
                    };
                    gw_com_module.gridSetLabel(args);

                }
                var thd = $("thead:first", $(obj)[0].grid.hDiv)[0];
                //$("tr.ui-jqgrid-labels th:eq(" + col_id + ")", thd).attr("title", this.text.toString().replace(/"/g, '\\"'));
                $("tr.ui-jqgrid-labels th:eq(" + col_id + ")", thd).attr("title", this.text);
            })

        } else if (param.type == "FORM") {

            $.each(param.element, function () {
                var ele = $("#" + param.targetid + "_" + this.name);
                if (this.text != "") {

                    $(ele).before($("<img src='/Style/images/others/grid_question.png' align='absmiddle' style='vertical-align: middle;'/>"));
                    $(ele).before("&nbsp;");

                }
                //$(ele).parent().attr("title", this.text.toString().replace(/"/g, '\\"'));;
                $(ele).parent().attr("title", this.text.toString());;
            })

        }

    },
    // #endregion

    // Check Text Format : isEmail, isTelNo
    isEmail: function (email) {

        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);

    },
    isTelNo: function (email) {
        var regex = /^([0-9])+([0-9-])+$/;
        return regex.test(email);
    },

    // get Frame Object by page name
    getFrameByName: function (_objs, _name) {
        
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

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//