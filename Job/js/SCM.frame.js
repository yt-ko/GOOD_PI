//var v_global = {
//	sub_cat_no: null,
//	proj_no: null
//};

var gw_job_process = {
    ready: function () {
        var sub_cat_no = sub_cat_no = gw_com_api.getPageParameter("sub_cat_no");
        var proj_no = proj_no = gw_com_api.getPageParameter("proj_no");
        var mact_id = gw_com_api.getPageParameter("mact_id")

        setURL(sub_cat_no, proj_no, mact_id);
        
        //setURL(sub_cat_no, proj_no);
        setTitle(sub_cat_no);
        
        $(window).css({
            minWidth: "1300px"
        })

        $(window).resize(function () {
            setMinSize(1220);
        });
    }
};


function setMinSize(w) {
    var wth = document.body.clientWidth;
    var hgt = document.body.clientHeight;

    if (wth < w)
        window.resizeBy(w - wth, 0);
}

function setURL(sub_cat_no, proj_no, mact_id) {
    var obj_id = null;
    var url = null;
    switch (sub_cat_no) {
        case "S00":
            {
                obj_id = "POP_8060";
            }
            break;
        case "S01":
            {
                obj_id = "SCM_8910";
            }
            break;
        case "S02":
            {
                obj_id = "POP_8061";
            }
            break;
        case "S11":
        case "S12":
            {
                obj_id = "w_iscm1080_R";
            }
            break;
        case "S21":
            {
                obj_id = "SCM_8050";
            }
            break;
        case "S31":
        case "S32":
            {
                obj_id = "SCM_8010"
            }
            break;
        case "S51":
            {
                obj_id = "SCM_8040"
            }
            break;
        case "S53":
            {
                obj_id = "SCM_8020"
            }
            break;
        case "S71":
        case "S61":
            {
                obj_id = "SCM_8030"
            }
            break;
        case "S99":
            {
                obj_id = "SCM_8090"
            }
            break;
        case "S90":
            {
                obj_id = "SCM_0000"
            }
            break;
        default:
            {
                obj_id = ""
            }
            break;
    }
    if (sub_cat_no == "S00")
        url = "../Dashboards/TotalView2.aspx";
    else if (sub_cat_no == "S02")
        url = "../Dashboards/TotalView3.aspx";
    else if(sub_cat_no == "S53")
        url = obj_id + ".aspx?proj_no=" + proj_no + "&mact_id=" + mact_id;
    else
        url = obj_id + ".aspx?proj_no=" + proj_no;
    if (obj_id == "") {
        url = "SCM_9999.aspx?sub_cat_no=" + sub_cat_no;
    } else {
        // Object Log
        gw_com_module.v_Current.window = gw_com_api.getPageParameter("menu_id");
        gw_com_module.v_Session.USR_ID = gw_com_api.getPageParameter("user_id");
        gw_com_module.objLog({ obj_id: obj_id, obj_title: getTitle(sub_cat_no) });
    }
    $('#fr').attr('src', url);

};

function setTitle(sub_cat_no) {

    var title = getTitle(sub_cat_no);
    $('#lblTitle').html(title);

};

function getTitle(sub_cat_no) {

    var title = "";
    switch (sub_cat_no) {
        case "S00":
            {
                title = "현장 상황판";
            }
            break;
        case "S01":
            {
                title = "프로젝트 Issue 발생 현황";
            }
            break;
        case "S02":
            {
                title = "현장 상황판 (SMC제조)";
            }
            break;
        case "S11":
        case "S12":
            {
                title = "프로젝트 의뢰 및 사양 정보";
            }
            break;
        case "S21":
            {
                title = "프로젝트 BOM 진행 현황";
            }
            break;
        case "S22":
            {
                title = "프로젝트 변경점 현황";
            }
            break;
        case "S23":
            {
                title = "프로젝트 도면 정보";
            }
            break;
        case "S31":
        case "S32":
            {
                title = "프로젝트 자재 진행 현황";
            }
            break;
        case "S41":
            {
                title = "프로젝트 성적서 현황";
            }
            break;
        case "S51":
            {
                title = "프로젝트 제조 진행 현황";
            }
            break;
        case "S53":
            {
                title = "프로젝트 문제 발생 현황"
            }
            break;
        case "S56":
            {
                title = "프로젝트 제조필요문서";
            }
            break;
        case "S99":
            {
                title = "프로젝트 외주 공정 현황"
            }
            break;
        case "S90":
            {
                title = "프로젝트 제조 진행 상세"
            }
            break;
        case "S71":
        case "S61":
            {
                title = "프로젝트 Set-Up 진행 정보"
            }
            break;
    }
    return title;

}
