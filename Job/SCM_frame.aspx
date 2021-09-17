<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SCM_frame.aspx.cs" Inherits="Job_SCM_frame" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style>
        iframe
        {
            width: 1200px;
            /*height: 800px;*/
        }
        span
        {
            font-family:'Malgun Gothic';
            font-weight:bold;
        }
        #title
        {
            margin:auto;
            width:1200px;
            height:50px;
        }
        img{
            padding-top:10px;
            position:absolute;
        }
    </style>
    <script src="js/SCM_frame.js" type="text/javascript"></script>
    <script type="text/javascript" src="../lib/js/lib.jquery.js"></script>
    <script type="text/javascript" src="../Lib/js/lib.blockui.js"></script>
    <script type="text/javascript" src="../Lib/js/lib.json.js"></script>
    <script type="text/javascript" src="../lib/js/gw.com.api.js"></script>
    <script type="text/javascript" src="../lib/js/gw.com.module.js"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();
            
        });
        
    </script>
    <script type="text/javascript">
        resizeFrame = function (args) {
            //alert(args.height);
            if (args.height < 545) args.height = 545;
            $("#fr").attr("height", args.height + 5);
        }
    </script>
</head>

<body>
    <form id="form1" runat="server">
        <div id ="title">
            <div id="divimg">
                <img alt="" src="http://board.ips.co.kr/images/logo.png" >
            </div>
            <div style="text-align: center">
                <span class="dxeBase_Material" id="lblTitle" style="font-size: 26pt;"></span>
            </div>
        </div>
    <div style="text-align:center;">
       <iframe frameborder="0" id="fr" scrolling="no" src ="">
       </iframe>
    </div>
    </form>
</body>
</html>
