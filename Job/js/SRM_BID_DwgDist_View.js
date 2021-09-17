//------------------------------------------
// 입찰견적-도면배포 View
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
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


        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data.
        v_global.logic.dist_no = "";

        var args = {
            request: [
                {
                    type: "PAGE", name: "상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "QMI41" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();
        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "저장", value: "확인" },
                { name: "삭제", value: "취소" },
                { name: "기타", value: "도면배포 시스템 열기" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "dist_no", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "dist_no", label: { title: "배포번호 :" },
				                editable: { type: "text", size: 12, validate: { rule: "required", message: "배포번호" } }
				            }
                            //,
				            //{
				            //    name: "dist_user_nm", label: { title: "배포자 :" },
				            //    editable: { type: "text", size: 12, validate: { message: "배포자" } }
				            //},
				            //{
				            //    name: "dist_nm", label: { title: "배포명 :" },
				            //    editable: { type: "text", size: 20, validate: { message: "배포명" } }
				            //}
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "SRM_BID_DwgDist_Main", title: "도면 배포 정보",
            caption: false, height: 60, show: true, selectable: true, dynamic: true, //key: true, readonly: true,
            element: [
				{ header: "배포번호", name: "dist_no", width: 80, align: "center" },
				{ header: "배포명", name: "dist_nm", width: 120 },
				{ header: "상태", name: "dist_yn", width: 60, align: "center" },
                { header: "배포자", name: "dist_user_nm", width: 70, align: "center" },
                { header: "시작일", name: "dists_ymd", width: 80, align: "center" },
                { header: "종료일", name: "diste_ymd", width: 80, align: "center" },
                { name: "person_fax", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        var args = {
            targetid: "grdList_ITEM", query: "SRM_BID_DwgDist_ITEM", title: "대상 품목",
            caption: true, height: 80, show: true, selectable: true, number: true, dynamic: true, key: true,
            element: [
				{ header: "Seq.", name: "item_seq", width: 60, align: "center" },
				{ header: "품목코드,", name: "item_no", width: 100 },
				{ header: "Ver.", name: "ver_no", width: 40, align: "center" },
                { header: "품명", name: "item_nm", width: 200 },
                { name: "dist_no", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        var args = {
            targetid: "grdList_SUPP", query: "SRM_BID_DwgDist_SUPP", title: "대상 협력사",
            caption: true, height: 60, show: true, selectable: true, number: true, dynamic: true, key: true,
            element: [
				{ header: "수신자ID", name: "rcvr_id", width: 80, align: "center" },
				{ header: "수신자명", name: "rcvr_nm", width: 120 },
				{ header: "업체코드", name: "supp_cd", width: 80, align: "center" },
				{ header: "업체명", name: "supp_nm", width: 120, align: "center" },
                { name: "dist_no", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_ITEM", offset: 8 },
                { type: "GRID", id: "grdList_SUPP", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();
    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "기타", event: "click", handler: processInLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {
    if (param.object == "lyrMenu") {
        if (param.dist_no == undefined) {
            v_global.logic.dist_no = gw_com_api.getValue("frmOption", 1, "dist_no", false);
            if (v_global.logic.dist_no == "") {
                gw_com_api.messageBox([{ text: "조회할 배포번호를 1자 이상 입력해야합니다." }], 500);
                return;
            }
        }
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_dist_no", value: v_global.logic.dist_no }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_ITEM" },
                { type: "GRID", id: "grdList_SUPP" }
            ],
            handler_complete: processRetrieveEnd
        };
        gw_com_module.objRetrieve(args);
    }
    else {
        v_global.logic.dist_no = gw_com_api.getValue("grdList_MAIN", "selected", "dist_no", true);
        var args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected", block: true,
                element: [
                    { name: "dist_no", argument: "arg_dist_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_ITEM" },
                { type: "GRID", id: "grdList_SUPP" }
            ],
            key: v_global.logic.dist_no
        };
        gw_com_module.objRetrieve(args);
    }


}
//----------
function processRetrieveEnd(param) {

}
//----------
function processSave(param) {
    if (gw_com_api.getRowCount("grdList_MAIN") < 1) return;

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    args.data = { edit: "save", dwg_dist_no: gw_com_api.getValue("grdList_MAIN", "selected", "dist_no", true) };
    gw_com_module.streamInterface(args);

}
//----------
function processDelete(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    args.data = { edit: "delete", dwg_dist_no: "" };
    gw_com_module.streamInterface(args);

}
//----------
function processInLink(param) {

    var url = "http://dist.ips.co.kr";
    window.open(url);
}
//----------
function processClear(param) {

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

}
//----------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                if (param.data != undefined) {
                    //gw_com_api.setValue("frmOption", 1, "dist_no", param.data.dist_no);
                    v_global.logic.dist_no = param.data.dist_no;
                    v_global.logic.edit_yn = param.data.mode;
                    gw_com_api.setValue("frmOption", 1, "dist_no", v_global.logic.dist_no)
                    if (v_global.logic.edit_yn == "select") {
                        gw_com_api.show("frmOption");
                        gw_com_api.show("lyrMenu", "조회", false);
                        gw_com_api.show("lyrMenu", "저장", false);
                        gw_com_api.show("lyrMenu", "삭제", false);
                    } else if (v_global.logic.edit_yn == "view") {
                        gw_com_api.show("frmOption");
                        gw_com_api.show("lyrMenu", "조회", false);
                        gw_com_api.show("lyrMenu", "저장", false);
                        gw_com_api.show("lyrMenu", "삭제", false);
                    } else {
                        gw_com_api.hide("frmOption");
                        gw_com_api.hide("lyrMenu", "조회", false);
                        gw_com_api.hide("lyrMenu", "저장", false);
                        gw_com_api.hide("lyrMenu", "삭제", false);
                        gw_com_api.hide("lyrMenu", "삭제", false);
                        gw_com_api.hide("grdList_SUPP");
                    }
                    if (v_global.logic.dist_no != "")
                        processRetrieve({ object: "lyrMenu", dist_no: v_global.logic.dist_no });
                }
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "":
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//