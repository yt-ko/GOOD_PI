using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Web.Script.Serialization;

public partial class Job_DLG_UploadFile : System.Web.UI.Page
{
    string strDataType = "ZF";
    string strNetwork = "HTTP";
    List<Data> row = new List<Data>();

    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
        {
            return;
        }
        strDataType = lstParam["DATA_TYPE"].ToString();
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        if (!e.IsValid) return;

        #region 1. Mapping Argument.

        // 1. Mapping Argument.
        //
        string strName = e.UploadedFile.FileName;
        string strType = Path.GetExtension(e.UploadedFile.FileName).Replace(".", "");

        #endregion

        SqlConnection objCon = null;
        SqlTransaction objTran = null;
        SqlCommand objCmd = null;
        try
        {
            #region 2. DB Connection Open.

            objCon = new SqlConnection(
                                ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();

            #endregion

            #region 3. Run Procedure.

            objTran = objCon.BeginTransaction();

            string strSQL = "sp_getNewFileID";
            objCmd = new SqlCommand(strSQL, objCon, objTran);
            objCmd.CommandText = strSQL;
            objCmd.Parameters.AddWithValue("@FileName", strName);
            objCmd.Parameters.AddWithValue("@DataType", strDataType);
            objCmd.Parameters.AddWithValue("@NetworkCode", strNetwork);
            objCmd.Parameters.Add("@FileID", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
            objCmd.Parameters.Add("@FilePath", SqlDbType.VarChar, 255).Direction = ParameterDirection.Output;
            objCmd.CommandType = CommandType.StoredProcedure;

            objCmd.ExecuteNonQuery();
            objTran.Commit();

            #endregion

            #region 4. Get Result.

            // 4. Get Result.
            //
            string strID = objCmd.Parameters["@FileID"].Value.ToString();
            string strPath = objCmd.Parameters["@FilePath"].Value.ToString();
            if (string.IsNullOrEmpty(strID) || string.IsNullOrEmpty(strPath))
            {
                throw new Exception
                    ("저장할 파일 ID와 경로를 가져올 수 없습니다.");
            }
            if (!Directory.Exists(strPath))
                Directory.CreateDirectory(strPath);
            string strSave = strPath + strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType);
            e.UploadedFile.SaveAs(strSave);
            row.Add(new global::Job_DLG_UploadFile.Data
            {
                file_id = strID,
                file_nm = strName,
                file_ext = strType,
                file_path = strPath
            });
            #endregion
        }
        catch (Exception ex)
        {
            #region 5. Exception.

            // 5. Exception.
            //
            if (objTran != null)
                objTran.Rollback();

            throw ex;

            #endregion
        }
        finally
        {
            #region 6. Release Object.

            // 6. Release Object.
            //
            if (objCon != null)
                objCon.Close();

            #endregion
        }
    }

    protected void ctlUpload_FilesUploadComplete(object sender, DevExpress.Web.FilesUploadCompleteEventArgs e)
    {
        e.CallbackData = new JavaScriptSerializer().Serialize(new { data = row });
        row.Clear();
    }

    protected void ZFILE()
    {

    }
    public class Data
    {
        public string file_id { get; set; }
        public string file_nm { get; set; }
        public string file_ext { get; set; }
        public string file_path { get; set; }
    }

}
