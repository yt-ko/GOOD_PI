﻿using System;
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

public partial class Job_EDM_Upload : System.Web.UI.Page
{
    string strData = "KMF";
    string strNetwork = "HTTP";

    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
            strData = "KMF";
        else
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
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();
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

            // 4. Get Result.
            string strID = objCmd.Parameters["@FileID"].Value.ToString();
            string strPath = objCmd.Parameters["@FilePath"].Value.ToString();
            if (string.IsNullOrEmpty(strID) || string.IsNullOrEmpty(strPath))
            {
                throw new Exception
                    ("저장할 파일 ID와 경로를 가져올 수 없습니다.");
            }
            string strSave = strPath + strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType);

            if (!Directory.Exists(strPath)) Directory.CreateDirectory(strPath);
            e.UploadedFile.SaveAs(strSave);
            e.CallbackData = strID + "@" + strName + "@" + strType + "@" + strPath;
        }
        catch (Exception ex)
        {
            if (objTran != null) objTran.Rollback();
            throw ex;
        }
        finally
        {
            if (objCon != null) objCon.Close();
        }
    }

    #region Update() : Update Process

    /// <summary>
    /// Update() : Update Process
    ///     : Insert/Update/Delete Process to DB.
    ///     input : 
    ///         - DATA - Client Data (cSaveData)
    ///     output:
    ///         - success : Key List (cSavedData)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Update(cSaveData DATA)
    {
        #region check Argument.

        // check Argument.
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

        string strReturn = string.Empty;
        List<cSavedData> lstSaved = new List<cSavedData>();
        cUpdate objUpdate = new cUpdate();
        try
        {
            objUpdate.initialize(false);

            #region Customize.

            //---------------------------------------------------------------------------
            string strKey = string.Empty;
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                if (DATA.getObject(iAry).getQuery() == "EDM_2010_S_1"
                    && DATA.getObject(iAry).getFirst().getType() == typeQuery.INSERT)
                {
                    strKey = getNewSeq(objUpdate, "EDM_FOLDER_D", DATA.getObject(iAry).getFirst().getValue("folder_id"));
                    DATA.getObject(iAry).getFirst().setValue("file_seq", strKey);
                }
            }
            //---------------------------------------------------------------------------

            #endregion

            #region process Saving.

            // process Saving.
            //
            objUpdate.beginTran();
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                lstSaved.Add(
                    objUpdate.process(DATA.getObject(iAry), DATA.getUser())
                );
            }

            #endregion

            #region normal Closing.

            // normal Closing.
            //
            objUpdate.close(doTransaction.COMMIT);
            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<List<cSavedData>>(
                                    codeProcessed.SUCCESS,
                                    lstSaved)
                            );

            #endregion
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            objUpdate.close(doTransaction.ROLLBACK);
            strReturn = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    ex.Message)
                            );

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            objUpdate.release();

            #endregion
        }

        return strReturn;
    }

    private static string getNewSeq(cUpdate objUpdate, string _KeyType, string _KeyValue)
    {
        string sSeq = string.Empty;
        try
        {
            string sQry = "SELECT dbo.FN_CREATEKEY('" + _KeyType + "','" + _KeyValue + "')";
            objUpdate.objDr = (new cDBQuery(ruleQuery.INLINE, sQry)).retrieveQuery(objUpdate.objCon);
            if (objUpdate.objDr.Read()) sSeq = objUpdate.objDr[0].ToString();
            objUpdate.objDr.Close();
        }
        catch (SqlException ex)
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(codeProcessed.ERR_SQL,
                                "Sequance No.를 생성할 수 없습니다.\n- " + ex.Message))
                );
        }
        catch (Exception ex)
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                                "Sequance No.생성 중에 오류가 발생하였습니다.\n- " + ex.Message))
                );
        }
        return sSeq;
    }

    #endregion
}
