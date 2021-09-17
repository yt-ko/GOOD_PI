//------------------------------------------
// Plug-in for Flag Menu Processing.
//				Referred to AjaxFlagMenu v1.0.2 by Seddiki Mohammed <seddikimohammed@gmail.com>
//				Modified by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

(function ($, document) {
    $.fn.AjaxFlagMenu = function (Options) {

        var LastSelectedItem = null;
        function AjaxFlagMenuItem(_Title, _onOutIcon, _onOverIcon, _onClickIcon, _HtmlStatusContent, _url, _data) {
            var Title = $("<tr><td align='center'>" + _Title + "</td></tr>");
            var Icon = $("<tr><td align='center'><img style='width:60px; height:44px;'/></td></tr><tr></tr>");
            var _AjaxFlagMenuItem = $("<li><table></table></li>");
            _AjaxFlagMenuItem.find("table").attr("border", "0px");
            _AjaxFlagMenuItem.find("table").attr("width", "100%");
            _AjaxFlagMenuItem.attr("title", Title.text());
            _AjaxFlagMenuItem.find("table").append(Icon).append(Title);
            _AjaxFlagMenuItem.css("cursor", "pointer");
            _AjaxFlagMenuItem.css("padding", "1px");
            this.jQueryObject = _AjaxFlagMenuItem;
            this.setOnOutStatus = function () {
                setIcon(_onOutIcon);
                setAjaxFlagMenuItemClass(Options.onOutClass);
            };
            this.isClicked = function () {
                return _AjaxFlagMenuItem.hasClass(Options.onClickClass);
            };
            function setIcon(img) {
                Icon.find("img").attr("src", img);
            };
            function setAjaxFlagMenuItemClass(_class) {
                _AjaxFlagMenuItem.attr("class", _class);
            };
            function setHtmlStatusContentClass(_class) {
                if (_HtmlStatusContent != '') {
                    var $aa = Icon.find("div");
                    Icon.find("div").attr("class", _class);
                }
            };
            _AjaxFlagMenuItem.mouseover(function () {
                if (!_AjaxFlagMenuItem.hasClass(Options.onClickClass)) {
                    //setIcon(_onOverIcon);
                    setAjaxFlagMenuItemClass(Options.onOverClass);
                }
            });
            _AjaxFlagMenuItem.mouseout(function () {
                if (!_AjaxFlagMenuItem.hasClass(Options.onClickClass)) {
                    //setIcon(_onOutIcon);
                    setAjaxFlagMenuItemClass(Options.onOutClass);
                }
            });
            var caption = _Title.replace("<br>", " ");
            _AjaxFlagMenuItem.click(function () {
                if (!_AjaxFlagMenuItem.hasClass(Options.onClickClass)) {
                    //setIcon(_onClickIcon);
                    setAjaxFlagMenuItemClass(Options.onClickClass);
                    if (LastSelectedItem != null) {
                        LastSelectedItem.setOnOutStatus();
                    }
                }
                gw_job_process.processTab(_data, caption, _url, "");
                window.scroll(0, 0);
            });
        };

        //var Caption = $("<li><span style='font-size:16px'>" + Options.Caption + "</span></li>");
        //Caption.addClass(Options.CaptionClass);
        var iTems = new Array();
        var AjaxFlagMenu = $("<ul class='srmMenu_bottom' style='margin:0; padding:0;'></ul>");
        AjaxFlagMenu.css("list-style", "none");
        //AjaxFlagMenu.append(Caption);
        this.add = function (_Options) {
            var item = new AjaxFlagMenuItem(_Options.Title, _Options.onOutIcon, _Options.onOverIcon, _Options.onClickIcon, _Options.HtmlSatusContent, _Options.url, _Options.data);
            item.setOnOutStatus();
            iTems.push(item);
            AjaxFlagMenu.append(item.jQueryObject);
            return item;
        };

        AjaxFlagMenu.mousemove(function () {
            for (var i = 0; i < iTems.length; i++) {
                if (iTems[i].isClicked()) {
                    LastSelectedItem = iTems[i];
                    break;
                }
            }
        });

        $(this).append(AjaxFlagMenu);

        return this;
    };

})(jQuery, document);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//