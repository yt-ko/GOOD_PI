using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Text.RegularExpressions;
using DevExpress.Web.ASPxHtmlEditor;
using System.Web.Services;
using System.Web;

public partial class Job_SRM_1023 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void ASPxHtmlEditor1_HtmlCorrecting(object sender, HtmlCorrectingEventArgs e)
    {
        Regex regex = new Regex("<img[^/]+src=[\"'](?<data>data:image/[^'\"]*)[\"'][^/]*/>");
        e.Html = regex.Replace(e.Html, new MatchEvaluator(m => {
            string base64Value = m.Groups["data"].Value;
            string tagStr = m.Value;
            return tagStr.Replace(base64Value, CreateImageFromBase64(base64Value));
        }));
    }

    [WebMethod]
    public static string CreateImageFromBase64(string base64String)
    {
        base64String = base64String.Split(new string[] { "base64," }, StringSplitOptions.RemoveEmptyEntries)[1];
        byte[] imageBytes = Convert.FromBase64String(base64String);
        using (MemoryStream ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
        {
            ms.Write(imageBytes, 0, imageBytes.Length);
            using (Image image = Image.FromStream(ms, true))
            {
                string serverPath = string.Format("~/Files/EDIT_FILES/images/{0}{1}", Guid.NewGuid(), GetFileExtension(image));
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

        if (HttpContext.Current != null)
        {
            Regex regex = new Regex("<img[^/]+src=[\"'](?<data>data:image/[^'\"]*)[\"'][^/]*/>");
            html = regex.Replace(html, new MatchEvaluator(m => {
                string base64Value = m.Groups["data"].Value;
                string tagStr = m.Value;
                return tagStr.Replace(base64Value, CreateImageFromBase64(base64Value));
            }));
        }

        return html;
    }

}