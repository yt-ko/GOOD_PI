//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연구소 설비 가동 현황
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

// Default, Run, Idle, H/W Modify, H/W Test, 계측, Down, Demo 대기, 설비교육
var _colorStatus = ["#FFFFFF", "#6799FF", "#8C8C8C", "#8041D9", "#D941C5", "#ABF200", "#F15F5F", "#FFBB00", "#FAF4C0"];

//var _colorRun = "#6799FF";
//var _colorDown = "#F15F5F";
//var _colorIdle = "#8C8C8C";
//var _colorTest = "#86E57F";
//var _colorDefault = "#FFFFFF";
var _timer;
v_global.logic.retrieveInterval = 180000;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();
        
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();

        	processRetrieve({}); // 자동 조회
        	_timer = setInterval(function () {
        	    processRetrieve({}); // 자동 조회
        	    //clearInterval(timer);
        	}, v_global.logic.retrieveInterval);
        }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrRemark2",
            row: [
                {
                    element: [
                        { name: "rmk1" }
                    ]
                }
            ]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        //==== 배치도 : Form ====
        var strContents = '<table id="tbl_canvas" width="1000" height="505" border="0" cellpadding="0" cellspacing="0">'
                        + '	<tr>'
                        + '		<td id="td_canvas" valign="top" width="900">'
                        + '			<div id="div_ALD-01" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-01" align="center" valign="middle" bgcolor="#FFFFFF">ALD<br>01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-02" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-02" align="center" valign="middle" bgcolor="#FFFFFF">ALD<br>02</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-02" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-02" align="center" valign="middle" bgcolor="#FFFFFF">CVD<br>02</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-03" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-03" align="center" valign="middle" bgcolor="#FFFFFF">CVD<br>03</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-05" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-05" align="center" valign="middle" bgcolor="#FFFFFF">CVD<br>05</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-01" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-01" align="center" valign="middle" bgcolor="#FFFFFF">CM<br>01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-06" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-06" align="center" valign="middle" bgcolor="#FFFFFF">ALD<br>06</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-02" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-02" align="center" valign="middle" bgcolor="#FFFFFF">CM<br>02</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-01" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-01" align="center" valign="middle" bgcolor="#FFFFFF">CVD<br>01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-04" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-04" align="center" valign="middle" bgcolor="#FFFFFF">CVD<br>04</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-05" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-05" align="center" valign="middle" bgcolor="#FFFFFF">ALD<br>05</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-06" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-06" align="center" valign="middle" bgcolor="#FFFFFF">CVD<br>06</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-07" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-07" align="center" valign="middle" bgcolor="#FFFFFF">CVD<br>07</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-04" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-04" align="center" valign="middle" bgcolor="#FFFFFF">ALD<br>04</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-03" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="30" height="54" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-03" align="center" valign="middle" bgcolor="#FFFFFF">CM<br>03</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-01_PM2" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-01_PM2" align="center" valign="middle" bgcolor="#FFFFFF">PM 02</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-01_PM1" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-01_PM1" align="center" valign="middle" bgcolor="#FFFFFF">PM 01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-02_PM2" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-02_PM2" align="center" valign="middle" bgcolor="#FFFFFF">PM 02</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-02_PM1" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-02_PM1" align="center" valign="middle" bgcolor="#FFFFFF">PM 01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-02_PMC" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-02_PMC" align="center" valign="middle" bgcolor="#FFFFFF">PM C</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-02_PMB" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-02_PMB" align="center" valign="middle" bgcolor="#FFFFFF">PM B</td></tr></table>'
                        + '			</div></div>'
//                        + '			<div id="div_CVD-03_PM3" style="position:relative;"><div style="position:absolute;">'
//                        + '				<table width="52" height="23" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-03_PM3" align="center" valign="middle" bgcolor="#FFFFFF">PM 03</td></tr></table>'
//                        + '			</div></div>'
                        + '			<div id="div_CVD-03_PM2" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-03_PM2" align="center" valign="middle" bgcolor="#FFFFFF">PM 02</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-03_PM5" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-03_PM5" align="center" valign="middle" bgcolor="#FFFFFF">PM 05</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-05_PMC" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-05_PMC" align="center" valign="middle" bgcolor="#FFFFFF">PM C</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-05_PMB" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-05_PMB" align="center" valign="middle" bgcolor="#FFFFFF">PM B</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-05_PMA" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-05_PMA" align="center" valign="middle" bgcolor="#FFFFFF">PM A</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-01_PM1" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-01_PM1" align="center" valign="middle" bgcolor="#FFFFFF">PM 01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-01_PM3" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-01_PM3" align="center" valign="middle" bgcolor="#FFFFFF">PM 03</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-01_PM5" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-01_PM5" align="center" valign="middle" bgcolor="#FFFFFF">PM 05</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-02_PM1" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-02_PM1" align="center" valign="middle" bgcolor="#FFFFFF">PM 01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-02_PM3" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-02_PM3" align="center" valign="middle" bgcolor="#FFFFFF">PM 03</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-02_PM5" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-02_PM5" align="center" valign="middle" bgcolor="#FFFFFF">PM 05</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-06_PMA" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-06_PMA" align="center" valign="middle" bgcolor="#FFFFFF">PM A</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-01_PM3" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-01_PM3" align="center" valign="middle" bgcolor="#FFFFFF">PM 03</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-01_PM5" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-01_PM5" align="center" valign="middle" bgcolor="#FFFFFF">PM 05</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-04_PMB" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-04_PMB" align="center" valign="middle" bgcolor="#FFFFFF">PM B</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-04_PMA" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-04_PMA" align="center" valign="middle" bgcolor="#FFFFFF">PM A</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-05_PM1" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-05_PM1" align="center" valign="middle" bgcolor="#FFFFFF">PM 01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-05_PM2" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-05_PM2" align="center" valign="middle" bgcolor="#FFFFFF">PM 02</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-06_PMA" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-06_PMA" align="center" valign="middle" bgcolor="#FFFFFF">PM A</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-06_PMC" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-06_PMC" align="center" valign="middle" bgcolor="#FFFFFF">PM C</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-06_PMB" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-06_PMB" align="center" valign="middle" bgcolor="#FFFFFF">PM B</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-07_PMA" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-07_PMA" align="center" valign="middle" bgcolor="#FFFFFF">PM A</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-07_PMC" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-07_PMC" align="center" valign="middle" bgcolor="#FFFFFF">PM C</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CVD-07_PMB" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CVD-07_PMB" align="center" valign="middle" bgcolor="#FFFFFF">PM B</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-04_PM4" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-04_PM4" align="center" valign="middle" bgcolor="#FFFFFF">PM 04</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-04_PM3" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-04_PM3" align="center" valign="middle" bgcolor="#FFFFFF">PM 03</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-04_PM2" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-04_PM2" align="center" valign="middle" bgcolor="#FFFFFF">PM 02</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_ALD-04_PM1" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_ALD-04_PM1" align="center" valign="middle" bgcolor="#FFFFFF">PM 01</td></tr></table>'
                        + '			</div></div>'
                        + '			<div id="div_CM-03_PM2" style="position:relative;"><div style="position:absolute;">'
                        + '				<table width="52" height="22" border=1 cellspacing=0 cellpadding=0><tr><td id="td_CM-03_PM2" align="center" valign="middle" bgcolor="#FFFFFF">PM 02</td></tr></table>'
                        + '			</div></div>'
                        + '		</td>'
                        + '     <td width="100" valign="top">'
                        + '         <br>'
                        + '         <div><table border="1" width="90" height="26"><tr><td bgcolor="' + _colorStatus[1] + '">Run</td></tr></table></div>'
                        + '         <div><table border="1" width="90" height="26"><tr><td bgcolor="' + _colorStatus[2] + '">Idle</td></tr></table></div>'
                        + '         <div><table border="1" width="90" height="26"><tr><td bgcolor="' + _colorStatus[3] + '">H/W Modify</td></tr></table></div>'
                        + '         <div><table border="1" width="90" height="26"><tr><td bgcolor="' + _colorStatus[4] + '">H/W Test</td></tr></table></div>'
                        + '         <div><table border="1" width="90" height="26"><tr><td bgcolor="' + _colorStatus[5] + '">계측</td></tr></table></div>'
                        + '         <div><table border="1" width="90" height="26"><tr><td bgcolor="' + _colorStatus[6] + '">Down</td></tr></table></div>'
                        + '         <div><table border="1" width="90" height="26"><tr><td bgcolor="' + _colorStatus[7] + '">Demo 대기</td></tr></table></div>'
                        + '         <div><table border="1" width="90" height="26"><tr><td bgcolor="' + _colorStatus[8] + '">설비교육</td></tr></table></div>'
                        + '     </td>'
                        + '	</tr>'
                        + '</table>';

        $("#lyrMain").html(strContents);

        $("#tbl_canvas").wrap("<center>");
        $("#tbl_canvas").css("font-family", "굴림체");
        $("#tbl_canvas").css("font-size", "8pt");
        $("#tbl_canvas").css("font-weight", "bold");
        $("#td_canvas").css("background-image", "url('../style/images/EOM_2190.png')");
        $("#td_canvas").css("background-repeat", "no-repeat");
        $("#td_canvas").css("background-position", "center");
        //=====================================================================================
        var args = {
            targetid: "grdData_List", query: "EOM_2190", title: "장비상태", show: false,
            element: [
				        { header: "ID", name: "id", width: 20, align: "center" },
				        { header: "상태", name: "stat", width: 80, align: "center" },
				        { header: "TYPE", name: "type", width: 120, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        gw_com_module.informSize();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);

        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        SetProperties("div_ALD-01", "77", "200", "E");
        SetProperties("div_ALD-02", "155", "200", "E");
        SetProperties("div_CVD-02", "301", "200", "E");
        SetProperties("div_CVD-03", "381", "200", "E");
        SetProperties("div_CVD-05", "57", "266", "E");
        SetProperties("div_CM-01", "120", "266", "E");
        SetProperties("div_CM-02", "188", "266", "E");
        SetProperties("div_ALD-06", "304", "266", "E");
        SetProperties("div_CVD-01", "368", "266", "E");
        SetProperties("div_CVD-04", "118", "455", "E");
        SetProperties("div_ALD-05", "82", "524", "E");
        SetProperties("div_CVD-06", "167", "524", "E");
        SetProperties("div_CVD-07", "384", "524", "E");
        SetProperties("div_ALD-04", "316", "455", "E");
        SetProperties("div_CM-03", "388", "455", "E");
        SetProperties("div_ALD-01_PM2", "78", "141", "M");
        SetProperties("div_ALD-01_PM1", "107", "141", "M");
        SetProperties("div_ALD-02_PM2", "158", "141", "M");
        SetProperties("div_ALD-02_PM1", "185", "141", "M");
        SetProperties("div_CVD-02_PMC", "303", "141", "M");
        SetProperties("div_CVD-02_PMB", "332", "141", "M");
        //SetProperties("div_CVD-03_PM3", "382", "61", "M");
        SetProperties("div_CVD-03_PM2", "396", "141", "M");
        SetProperties("div_CVD-03_PM5", "422", "141", "M");
        SetProperties("div_CVD-05_PMC", "31", "307", "M");
        SetProperties("div_CVD-05_PMB", "55", "307", "M");
        SetProperties("div_CVD-05_PMA", "79", "307", "M");
        SetProperties("div_CM-01_PM1", "104", "307", "M");
        SetProperties("div_CM-01_PM3", "131", "307", "M");
        SetProperties("div_CM-01_PM5", "157", "307", "M");
        SetProperties("div_CM-02_PM1", "182", "307", "M");
        SetProperties("div_CM-02_PM3", "206", "307", "M");
        SetProperties("div_CM-02_PM5", "230", "307", "M");
        SetProperties("div_ALD-06_PMA", "319", "305", "M");
        SetProperties("div_CVD-01_PM3", "367", "305", "M");
        SetProperties("div_CVD-01_PM5", "398", "305", "M");
        SetProperties("div_CVD-04_PMB", "120", "395", "M");
        SetProperties("div_CVD-04_PMA", "150", "395", "M");
        SetProperties("div_ALD-05_PM1", "84", "566", "M");
        SetProperties("div_ALD-05_PM2", "113", "566", "M");
        SetProperties("div_CVD-06_PMA", "155", "566", "M");
        SetProperties("div_CVD-06_PMC", "183", "566", "M");
        SetProperties("div_CVD-06_PMB", "212", "566", "M");
        SetProperties("div_CVD-07_PMA", "372", "566", "M");
        SetProperties("div_CVD-07_PMC", "400", "566", "M");
        SetProperties("div_CVD-07_PMB", "427", "566", "M");
        SetProperties("div_ALD-04_PM4", "294", "404", "M");
        SetProperties("div_ALD-04_PM3", "319", "395", "M");
        SetProperties("div_ALD-04_PM2", "346", "395", "M");
        SetProperties("div_ALD-04_PM1", "372", "404", "M");
        SetProperties("div_CM-03_PM2", "406", "395", "M");

        function SetProperties(_id, _top, _left, _type) {
            $("#" + _id).css({ "top": _top, "left": _left });
            $("#" + _id.replace("div_", "td_")).css("background-color", "#FFFFFF");

            var strTarget = "EOM_2160";
            var strTitle = "예약 및 가동내역";
            var arKey = (_id.substring(4) + "_").split("_");

            if (_type == "E") {
                // 설비
                $("#" + _id.replace("div_", "td_")).bind("click"
                    , function () {
                        var args = {
                            ID: gw_com_api.v_Stream.msg_linkPage,
                            to: {
                                type: "MAIN"
                            },
                            data: {
                                page: strTarget,
                                title: strTitle,
                                param: [
                                    { name: "eq_cd", value: arKey[0].replace("-", " ") }
                                ]
                            }
                        };
                        gw_com_module.streamInterface(args);
                    });
            } else {
                // 모듈
                $("#" + _id.replace("div_", "td_")).bind("click"
                    , function () {
                        var args = {
                            ID: gw_com_api.v_Stream.msg_linkPage,
                            to: {
                                type: "MAIN"
                            },
                            data: {
                                page: strTarget,
                                title: strTitle,
                                param: [
                                    { name: "eq_cd", value: arKey[0].replace("-", " ") },
                                    { name: "eq_module", value: arKey[1].replace("-", " ") }
                                ]
                            }
                        };
                        gw_com_module.streamInterface(args);
                    });
            }
        }

        gw_com_module.startPage();
    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRetrieve(param) {
    //$("#" + "td_ALD04_PM01").css("background-color", "#FF0000");

    var d1 = new Date();

    //장비상태 retrieve
    var args = {
        target: [
            { type: "GRID", id: "grdData_List" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: {
                time1: d1.format("HH시 mm분 ss초")
            }
        },
    };
    gw_com_module.objRetrieve(args);
}
//----------
function processRetrieveEnd(param) {

    for (var i = 1; i <= gw_com_api.getRowCount("grdData_List") ; i++) {
        var _id = gw_com_api.getValue("grdData_List", i, "id", true);
        var _status = gw_com_api.getValue("grdData_List", i, "stat", true);
        var _bgcolor = "";
        // Default, Run, Idle, H/W Modify, H/W Test, 계측, Down, Demo 대기, 설비교육
        switch (_status) {
            case "Run":
                _bgcolor = _colorStatus[1];
                break;
            case "Idle":
                _bgcolor = _colorStatus[2];
                break;
            case "H/W Modify":
                _bgcolor = _colorStatus[3];
                break;
            case "H/W Test":
                _bgcolor = _colorStatus[4];
                break;
            case "계측":
                _bgcolor = _colorStatus[5];
                break;
            case "Down":
                _bgcolor = _colorStatus[6];
                break;
            case "Demo 대기":
                _bgcolor = _colorStatus[7];
                break;
            case "설비교육":
                _bgcolor = _colorStatus[8];
                break;
            default:
                _bgcolor = _colorStatus[0];
                break;
        }

        $("#td_" + _id).css("background-color", _bgcolor);
        $("#td_" + _id).css("cursor", "pointer");
    }

    var args = {
        targetid: "lyrRemark2",
        row: [
		    {
		        name: "rmk1",
		        value: "최종 조회 시간 : " + param.time1
		    }
        ]
    };
    gw_com_module.labelAssign(args);

}
//----------
function processClose(param) {

    clearInterval(_timer);

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
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
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

Date.prototype.format = function (f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//