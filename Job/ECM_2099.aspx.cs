using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;
using System.Drawing;
     

public partial class JOB_ECM_2099 : System.Web.UI.Page
{

    public static string strRgstNo = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        //TimeSpan ts = new TimeSpan(0, 5, 0);
        //this.AsyncTimeout = ts;
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        //TimeSpan ts = new TimeSpan(0, 5, 0);
        //this.AsyncTimeout = ts;

        try
        {
            if (string.IsNullOrEmpty(strRgstNo))
                strRgstNo = Session["EMP_NO"].ToString();
            if (string.IsNullOrEmpty(strRgstNo))
                throw new Exception("사업자번호 점검 필요.\n관리자에게 문의 바랍니다.");

            string file = Path.Combine(Server.MapPath("~/"), @"Files\ECM_FILES\SIGN_FILES\" + strRgstNo + ".png");

            using (Stream stream = e.UploadedFile.FileContent)
            {
                using (Bitmap b = (Bitmap)Bitmap.FromStream(stream))
                {
                    if(b.Width > 64 || b.Height > 64)
                    {
                        using (Bitmap stamp = new Bitmap(b, new Size(64, 64)))
                        {
                            stamp.Save(file, System.Drawing.Imaging.ImageFormat.Png);
                        }
                    }
                    else
                    {
                        b.Save(file, System.Drawing.Imaging.ImageFormat.Png);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [WebMethod]
    public static string setRgstNo(string rgst_no)
    {
        strRgstNo = rgst_no;

        return new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(codeProcessed.SUCCESS, rgst_no)
                            );
    }

}
