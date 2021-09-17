using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.IO;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections.Specialized;

public partial class Job_w_upload_cem : System.Web.UI.Page
{
    string strData = "CEM";
    string strNetwork = "HTTP";

    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
        {
            return;
        }
        strData = lstParam["DATA_TYPE"].ToString();
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        #region 1. Mapping Argument.

        // 1. Mapping Argument.
        //
        string strName = e.UploadedFile.FileName;
        string [] strFile = strName.Split('.');
        string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;

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
            objCmd.Parameters.AddWithValue("@DataType", strData);
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
            strName = strPath + strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType);
            e.UploadedFile.SaveAs(strName);
            e.CallbackData = strID + "@" + strName;

            #endregion
        }
        catch (Exception)
        {
            #region 5. Exception.
            // 5. Exception.
            //
            if (objTran != null)
                objTran.Rollback();

            throw;

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

    #region Update() : Update Process (Client에서 저장 요청시 실행)

    /// <summary>
    /// Update() : Update Process (Client에서 저장 요청시 실행)
    ///     
    ///     Input 
    ///         : DATA - Client Data (cSaveData).
    ///     Output : string - 처리 결과 JSON type (cProcessed).
    /// </summary>
    [WebMethod]
    public static string Update(cSaveData DATA)
    {
        string strReturn = string.Empty;

        #region 1. Call Argument Check.

        // 1. Call Argument Check.
        //
        if (DATA.getSize() <= 0)
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion

        SqlConnection objCon = null;
        SqlTransaction objTran = null;
        SqlCommand objCmd = null;
        SqlDataReader objDr = null;
        try
        {
            #region 2. DB Connection Open.

            // 2. DB Connection Open.
            //
            try
            {
                objCon = new SqlConnection(
                                    ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
                objCon.Open();
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Database에 연결할 수 없습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region (A) Customizing. (여기에 코딩합니다.)

            //---------------------------------------------------------------------------
            //---------------------------------------------------------------------------

            #endregion

            #region 3. Transaction Open & Query Command 생성.

            // 3. Transaction Open & Query Command 생성.
            //
            try
            {
                objTran = objCon.BeginTransaction();
                objCmd = new SqlCommand(string.Empty, objCon, objTran);
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Query Process를 시작할 수 없습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Query Process 시작 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region 4~8. Object Update 처리.

            // 4~8. Object Update 처리.
            //
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                #region 5. Saving Module 생성.

                // 5. Saving Module 생성.
                //
                cSave objProcess = new cSave(
                                        DATA.getObject(iAry),
                                        DATA.getObject(iAry).getQuery());

                #endregion

                #region 6. DB Column 정보 Mapping.

                // 6. DB Column 정보 Mapping.
                //
                try
                {
                    objProcess.mapColumn(
                                    objCmd,
                                    objDr);
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_SQL,
                                        "Column 정보를 Mapping할 수 없습니다.\n -" + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_PROCESS,
                                        "Column 정보 Mapping 중에 오류가 발생하였습니다.\n -" + ex.Message)
                            )
                        );
                }

                #endregion

                #region (B) Customizing. (여기에 코딩합니다.)

                //---------------------------------------------------------------------------
                //---------------------------------------------------------------------------

                #endregion

                #region 7. DML 생성. (Insert/Update/Delete)

                // 7. DML 생성. (Insert/Update/Delete)
                //
                try
                {
                    objProcess.inlineQuery();
                }
                catch (Exception ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_PROCESS,
                                        "Query 생성 중에 오류가 발생하였습니다.\n -" + ex.Message)
                            )
                        );
                }

                #endregion

                #region 8. DML 실행. (Insert/Update/Delete)

                // 8. DML 실행. (Insert/Update/Delete)
                //
                try
                {
                    objProcess.executeSave(objCmd);
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.ERR_SQL,
                                    "Data 저장에 실패하였습니다.\n- (" + ex.Number + ") : " + ex.Message)
                                )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    "Data 저장에 실패하였습니다.\n- " + ex.Message)
                                )
                        );
                }

                #endregion

                #region (C) Customizing. (여기에 코딩합니다.)

                //---------------------------------------------------------------------------
                //---------------------------------------------------------------------------

                #endregion
            }

            #endregion

            #region 9. Commit Transaction.

            // 9. Commit Transaction.
            //
            try
            {
                objTran.Commit();
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Query Process를 Commit할 수 없습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Query Procedss Commit 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region (D) Customizing. (여기에 코딩합니다.)

            //---------------------------------------------------------------------------
            //---------------------------------------------------------------------------

            #endregion

            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.SUCCESS,
                                    "저장되었습니다.")
                            );
        }
        catch (Exception ex)
        {
            #region 10. Rollback Transaction.

            // 10. Rollback Transaction.
            //
            if (objTran != null)
                objTran.Rollback();

            #endregion

            strReturn = ex.Message;

            #region (E) Customizing. (여기에 코딩합니다.)

            //---------------------------------------------------------------------------
            if (objCon != null)
            {
				/*
                try
                {
                    string strSQL = @"
                        DELETE 
                        FROM   zfile 
                        WHERE  file_id = '" + DATA.getValue(0, 0, "file_id") + "'";
                    SqlCommand objBack = new SqlCommand(strSQL, objCon);
                    objBack.ExecuteNonQuery();
                    File.Delete(HttpUtility.UrlDecode(DATA.getOption().getValue("file")));
                }
                catch (Exception) { }
				*/
            }
            //---------------------------------------------------------------------------

            #endregion
        }
        finally
        {
            #region 11. Release Object.

            // 11. Release Object.
            //
            if (objDr != null)
                objDr.Close();
            if (objCon != null)
                objCon.Close();

            #endregion
        }

        return strReturn;
    }

    #endregion
}
