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

public partial class Job_w_pom9013 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
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
            #region initialize to Save.

            // initialize to Update.
            //
            objUpdate.initialize(false);

            #endregion

            #region Customize

            // Customize - Run Procedure.
            //
            for (int iRow = 0; iRow < DATA.getFirst().getSize(); iRow++)
            {
                try
                {
                    if (DATA.getFirst().getValue(iRow, "send_yn") == "1")
                    {
                        string strSQL = "PROC_SMS_STOCK";
                        objUpdate.objCmd.CommandText = strSQL;
                        objUpdate.objCmd.CommandType = CommandType.StoredProcedure;
                        objUpdate.objCmd.Parameters.AddWithValue(
                            "@user", HttpUtility.UrlDecode(DATA.getUser()));
                        objUpdate.objCmd.Parameters.AddWithValue(
                            "@cust_cd", HttpUtility.UrlDecode(DATA.getFirst().getValue(iRow, "cust_cd")));
                        objUpdate.objCmd.Parameters.AddWithValue(
                            "@message", HttpUtility.UrlDecode(DATA.getFirst().getValue(iRow, "message")));
                        objUpdate.objCmd.ExecuteNonQuery();
                        objUpdate.objCmd.Parameters.Clear();
                    }
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "전송에 실패하였습니다.\n- (" + ex.Number + ") : " + ex.Message)
                        )
                    );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "전송 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
                }
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

    #endregion
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
