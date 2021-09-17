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
        init: false,
        entry: null
    }
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
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption",
            type: "FREE",
            trans: true,
            show: true,
            border: false,
            align: "left",
            editable: {
                bind: "open",
                focus: "supp_nm",
                validate: true
            },/*
            remark: "lyrRemark",*/
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "supp_nm",
				                label: {
				                    title: "협력사명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20,
		                            validate: {
		                                rule: "required",
		                                message: "협력사명"
		                            }
				                }
				            },
				            {
				                name: "실행",
				                act: true,
				                show: false,
				                format: {
				                    type: "button"
				                }
				            }
				        ]
                    }/*,
				    {
                        align: "right",
                        element: [
				            {
				                name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button"
				                }
				            }
				        ]
				    }*/
				]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_협력사",
            query: "w_find_supplier_user",
            title: "협력사",
            height: "300",
            dynamic: true,
            show: true,
            number: true,
            key: true,
            element: [
				{
				    header: "협력사코드",
				    name: "supp_cd",
				    width: 90,
				    align: "center"
				},
				{
				    header: "협력사명",
				    name: "supp_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "사업자등록번호",
				    name: "rgst_no",
				    width: 100,
				    align: "center",
				    mask: "biz-no"
				},
				{
				    name: "user_id",
				    hidden: true
				},
				{
				    name: "user_tp",
				    hidden: true
				},
				{
				    name: "role_id",
				    hidden: true
				},
				{
				    name: "ht_no",
				    hidden: true
				},
				{
				    name: "tel_no",
				    hidden: true
				},
				{
				    name: "fax_no",
				    hidden: true
				},
				{
				    name: "zip_no",
				    hidden: true
				},
				{
				    name: "addr1",
				    hidden: true
				},
				{
				    name: "addr2",
				    hidden: true
				},
				{
				    name: "prsdnt_nm",
				    hidden: true
				},
				{
				    name: "exists_yn",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_협력사",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
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
    procedure: function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            targetid: "lyrMenu",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_협력사",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_협력사
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_협력사",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_협력사
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve();

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_closeDialogue
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve();

        }
        //----------
        function rowdblclick_grdData_협력사(ui) {

            informResult();

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
processRetrieve = function() {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false)
        return false;
        
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            //hide: true,
            element: [
				{
				    name: "supp_nm",
				    argument: "arg_supp_nm"
				}
			]/*,
            remark: [
		        {
		            element: [{ name: "supp_nm"}]
		        }
		    ]*/
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_협력사",
			    focus: true,
			    select: true
			}
		]
    };
    gw_com_module.objRetrieve(args);

};
//----------
function informResult() {

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedSupplier_User,
        data: {
            supp_cd: gw_com_api.getValue("grdData_협력사", "selected", "supp_cd", true),
            supp_nm: gw_com_api.getValue("grdData_협력사", "selected", "supp_nm", true),
            rgst_no: gw_com_api.getValue("grdData_협력사", "selected", "rgst_no", true),
            user_id: gw_com_api.getValue("grdData_협력사", "selected", "user_id", true),
            user_tp: gw_com_api.getValue("grdData_협력사", "selected", "user_tp", true),
            role_id: gw_com_api.getValue("grdData_협력사", "selected", "role_id", true),
            ht_no: gw_com_api.getValue("grdData_협력사", "selected", "ht_no", true),
            tel_no: gw_com_api.getValue("grdData_협력사", "selected", "tel_no", true),
            fax_no: gw_com_api.getValue("grdData_협력사", "selected", "fax_no", true),
            zip_no: gw_com_api.getValue("grdData_협력사", "selected", "zip_no", true),
            addr1: gw_com_api.getValue("grdData_협력사", "selected", "addr1", true),
            addr2: gw_com_api.getValue("grdData_협력사", "selected", "addr2", true),
            prsdnt_nm: gw_com_api.getValue("grdData_협력사", "selected", "prsdnt_nm", true),
            exists_yn: gw_com_api.getValue("grdData_협력사", "selected", "exists_yn", true)
        }
    };
    gw_com_module.streamInterface(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectSupplier:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.supp_nm
                        != gw_com_api.getValue("frmOption", 1, "supp_nm")) {
                        gw_com_api.setValue("frmOption", 1, "supp_nm", param.data.supp_nm);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve();
                gw_com_api.setFocus("frmOption", 1, "supp_nm");
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//