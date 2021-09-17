using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Job_GMS_RequestEdit : System.Web.UI.Page
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
                        new entityProcessed<string>(codeProcessed.ERR_PARAM,"잘못된 호출입니다.")
                    );
        }

        #endregion

        string strReturn = string.Empty;
        List<cSavedData> lstSaved = new List<cSavedData>();
        cUpdate objUpdate = new cUpdate();
        try
        {
            #region initialize to Save.
            objUpdate.initialize(false);

            #endregion

            #region Customize.

            string strKey = string.Empty;
            if (DATA.getFirst().getQuery() == "SYS_GMS_RQST" && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "SYS_GMS_RQST");
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
                                new entityProcessed<string>( codeProcessed.ERR_SQL, "Key를 생성할 수 없습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>( codeProcessed.ERR_PROCESS, "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                strKey = objProcedure.objCmd.Parameters["@NewKey"].Value.ToString();
                DATA.setValues("rqst_no", strKey);
            }
            //---------------------------------------------------------------------------

            #endregion

            #region process Saving.

            // process Saving.
            //
            objUpdate.beginTran();
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                // Set KeyNo to Sub for New Master
                if (!string.IsNullOrEmpty(strKey) && DATA.getObject(iAry).getQuery() != "SYS_GMS_RQST")
                {
                    string sKeyCol = "rqst_no";
                    if (DATA.getObject(iAry).getQuery().IndexOf("Memo") > 0) sKeyCol = "memo_no";
                    else if (DATA.getObject(iAry).getQuery().IndexOf("File") > 0) sKeyCol = "data_key";

                    for (int j = 0; j < DATA.getObject(iAry).getSize(); j++)
                    {
                        DATA.getObject(iAry).setValue(j, sKeyCol, strKey);
                    }
                }

                cSavedData s = objUpdate.process(DATA.getObject(iAry), DATA.getUser());
                // for Return key : 불필요
                //if (!string.IsNullOrEmpty(strKey) && DATA.getObject(iAry).getQuery() == "SYS_GMS_RQST") 
                //    s.addKey("rqst_no", strKey);
                // Add Saving Data
                lstSaved.Add(s);
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
