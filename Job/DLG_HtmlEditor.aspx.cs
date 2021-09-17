using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Text.RegularExpressions;
using DevExpress.Web.ASPxHtmlEditor;
using System.Web.Services;
using System.Web;

public partial class Job_DLG_HtmlEditor : System.Web.UI.Page
{
    // Image File Upload Folder 설정 : js 에서 convertHtml 호출 시 param 으로 전달
    // 2020.03.22 이전 : "~/Files/EDIT_FILES/images"
    // 2020.03.22 이후 : "~/Files/DxHtmlEditor/" + 호출 page ID
    private static string mImgFolder = "~/Files/DxHtmlEditor/";
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // Set UploadFolder & 
            mImgFolder = "~/Files/DxHtmlEditor/" + Request.QueryString["page"];
            // Create Directory when it is not exists
            string sPath = HttpContext.Current.Server.MapPath(mImgFolder);
            if (!Directory.Exists(sPath)) Directory.CreateDirectory(sPath);
            // Set Temp Folder : 불필요??? by JJJ
            ASPxctlHTML.SettingsDialogs.InsertImageDialog.SettingsImageSelector.EditingSettings.TemporaryFolder = mImgFolder;
        }
        
        // Set UploadFolder : PostBack 호출 될 때마다 초기화됨.
        ASPxctlHTML.SettingsDialogs.InsertImageDialog.SettingsImageUpload.FileSystemSettings.UploadFolder = mImgFolder;
    }

    protected void ASPxHtmlEditor1_HtmlCorrecting(object sender, HtmlCorrectingEventArgs e)
    {
        // Copy & Paste 한 Image Data를 File 로 변환 시켜줌
        // 정작 Image Data를 Paste 한 직후에는 발생하지 않음. 필요성 재검토 요 by JJJ
        Regex regex = new Regex("<img[^/]+src=[\"'](?<data>data:image/[^'\"]*)[\"'][^/]*/>");
        e.Html = regex.Replace(e.Html, new MatchEvaluator(m => {
            string base64Value = m.Groups["data"].Value;
            string tagStr = m.Value;
            return tagStr.Replace(base64Value, CreateImageFromBase64(base64Value));
        }));
    }

    // Image Upload Folder 및 File Name 설정
    [WebMethod]
    public static string CreateImageFromBase64(string base64String)
    {
        // Image Data를 File 로 변환 시켜줌
        base64String = base64String.Split(new string[] { "base64," }, StringSplitOptions.RemoveEmptyEntries)[1];
        byte[] imageBytes = Convert.FromBase64String(base64String);
        using (MemoryStream ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
        {
            ms.Write(imageBytes, 0, imageBytes.Length);
            using (Image image = Image.FromStream(ms, true))
            {
                string serverPath = string.Format("{0}/{1}{2}", mImgFolder, Guid.NewGuid(), GetFileExtension(image));
                image.Save(HttpContext.Current.Server.MapPath(serverPath));
                //return ResolveClientUrl(serverPath);
                return VirtualPathUtility.ToAbsolute(serverPath);
            }
        }
    }
    [WebMethod]
    public static string GetFileExtension(Image image)
    {
        ImageFormat format = image.RawFormat;
        string fileExtension = ".jpeg";
        if (ImageFormat.Bmp.Equals(format))
            fileExtension = ".bmp";
        else if (ImageFormat.Gif.Equals(format))
            fileExtension = ".gif";
        else if (ImageFormat.Png.Equals(format))
            fileExtension = ".png";
        return fileExtension;
    }

    [WebMethod]
    public static string convertHtml(string html)
    {
        // Copy & Paste 한 Image Data를 File 로 변환 시켜줌
        // Called by JS.convertHtml when save button
        if (HttpContext.Current != null)
        {
            Regex regex = new Regex("<img[^/]+src=[\"'](?<data>data:image/[^'\"]*)[\"'][^/]*/>");
            html = regex.Replace(html, new MatchEvaluator(m =>
            {
                string base64Value = m.Groups["data"].Value;
                string tagStr = m.Value;
                return tagStr.Replace(base64Value, CreateImageFromBase64(base64Value));
            }));
        }

        return html;
    }

}