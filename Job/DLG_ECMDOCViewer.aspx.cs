using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Job_DLG_ECMDOCViewer : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["AUTH"] == null)
        {
            this.ClientScript.RegisterClientScriptBlock(this.GetType(), "Alert1", "alert('장시간 미입력 등으로 정보가 유효하지 않습니다. 다시 로그인 후 사용해 주세요.');window.close();", true);
            return;
        }

        if (Session["USER_TP"].ToString().Equals("SYS"))
        {
            ASPxRichEdit1.RibbonMode = DevExpress.Web.ASPxRichEdit.RichEditRibbonMode.Ribbon;
        }
        else
        {
            ASPxRichEdit1.RibbonMode = DevExpress.Web.ASPxRichEdit.RichEditRibbonMode.None;
        }


        string DocNo = Request.Form["doc_no"];

        if (string.IsNullOrEmpty(DocNo))
            this.ClientScript.RegisterClientScriptBlock(this.GetType(), "Close1", "alert(\"파라메터 오류\");window.close();", true);
        else
        {
            string file = System.IO.Path.Combine(Server.MapPath("~/Report/ECM_1020"), DocNo + ".docx");
            ASPxRichEdit1.Open(file);
        }

    }
}