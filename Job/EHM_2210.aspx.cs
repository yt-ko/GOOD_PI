using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class JOB_EHM_2210 : System.Web.UI.Page
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

            #region Customize.

            //---------------------------------------------------------------------------
            string rqst_no = string.Empty;
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strKey = string.Empty;
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    if (DATA.getObject(iAry).getQuery() == "EHM_2210_1" && DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                    {
                        cProcedure objProcedure = new cProcedure();
                        // initialize to Call.
                        //
                        objProcedure.initialize();
                        try
                        {
                            string strSQL = "SP_KEYGEN_PLM";
                            objProcedure.objCmd.CommandText = strSQL;
                            objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "AS-STOCK");
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
                        strKey = objProcedure.objCmd.Parameters["@NewKey"].Value.ToString();
                        DATA.setValue(iAry, iRow, "rqst_no", strKey);

                        // 임시 예외처리
                        if (DATA.getValue(iAry, iRow, "rpr_no") == "%25")
                        {
                            DATA.setValue(iAry, iRow, "rpr_no", "");
                        }

                        if (DATA.getValue(iAry, iRow, "ser_no") == "%25")
                        {
                            DATA.setValue(iAry, iRow, "ser_no", "");
                        }

                        if (DATA.getValue(iAry, iRow, "issue_no") == "%25")
                        {
                            DATA.setValue(iAry, iRow, "issue_no", "");
                        }

                        if (DATA.getValue(iAry, iRow, "ncr_no") == "%25")
                        {
                            DATA.setValue(iAry, iRow, "ncr_no", "");
                        }

                        // 분석 담당자 자동생성 대상
                        if (!string.IsNullOrEmpty(DATA.getValue(iAry, iRow, "ncr_no")))
                        {
                            rqst_no += (strKey + "^");
                        }
                    }
                }
            }

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

            // 분석 담당자 자동생성
            if (!string.IsNullOrEmpty(rqst_no))
            {
                cProcedure objProcedure = new cProcedure();
                objProcedure.initialize();
                try
                {
                    string strSQL = "sp_EHM_RepairItem_CreateSub";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@data_tp", "EHM_REPAIR_ITEM_1");
                    objProcedure.objCmd.Parameters.AddWithValue("@data", rqst_no);
                    objProcedure.objCmd.Parameters.AddWithValue("@usr_id", DATA.getUser());
                    objProcedure.objCmd.Parameters.Add("@rtn_no", SqlDbType.Int).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.Parameters.Add("@rtn_msg", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                    objProcedure.objCmd.ExecuteNonQuery();
                    objProcedure.processTran(doTransaction.COMMIT);
                }
                catch
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);
                }
                objProcedure.release();
            }

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
