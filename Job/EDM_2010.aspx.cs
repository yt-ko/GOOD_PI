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

public partial class JOB_EDM_2010 : System.Web.UI.Page
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
        if (DATA.getSize() <= 0)
            return new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PARAM, "잘못된 호출입니다."));

        #endregion

        string strReturn = string.Empty;
        List<cSavedData> lstSaved = new List<cSavedData>();
        cUpdate objUpdate = new cUpdate();
        try
        {
            #region initialize to Save.

            // initialize to Update.
            objUpdate.initialize(false);

            #endregion

            #region Customize : 폴더 추가 시 폴더 ID 생성

            //---------------------------------------------------------------------------
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    // 폴더 추가 시 폴더 ID 생성
                    if (DATA.getObject(iAry).getQuery() == "EDM_2010_M_2"
                        && DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                    {
                        cProcedure objProcedure = new cProcedure();
                        // initialize to Call.
                        //
                        objProcedure.initialize();
                        try
                        {
                            string strSQL = "SP_KEYGEN_PLM";
                            objProcedure.objCmd.CommandText = strSQL;
                            objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "EDM");
                            objProcedure.objCmd.Parameters.Add("@NewKey", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                            objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                            objProcedure.objCmd.ExecuteNonQuery();
                            objProcedure.processTran(doTransaction.COMMIT);
                        }
                        catch (SqlException ex)
                        {
                            objProcedure.processTran(doTransaction.ROLLBACK);

                            throw new Exception(
                                    new JavaScriptSerializer().Serialize(
                                        new entityProcessed<string>(
                                                codeProcessed.ERR_SQL,
                                                "Key를 생성할 수 없습니다.\n- " + ex.Message)
                                    )
                                );
                        }
                        catch (Exception ex)
                        {
                            objProcedure.processTran(doTransaction.ROLLBACK);

                            throw new Exception(
                                    new JavaScriptSerializer().Serialize(
                                        new entityProcessed<string>(
                                                codeProcessed.ERR_PROCESS,
                                                "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                                    )
                                );
                        }
                        string strKey = objProcedure.objCmd.Parameters["@NewKey"].Value.ToString();
                        DATA.getObject(iAry).getRow(iRow).setValue("folder_id", strKey);
                    }
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
                                new entityProcessed<List<cSavedData>>( codeProcessed.SUCCESS, lstSaved)
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
