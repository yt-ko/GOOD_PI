﻿using System;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;

public partial class Job_w_qcm2020 : System.Web.UI.Page
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
            if (DATA.getFirst().getQuery() == "w_qcm2020_M_2"
                && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "POP");
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
                DATA.setValues("issue_no", strKey);
            }
            //---------------------------------------------------------------------------
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strID = string.Empty;
                string strKey = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "w_qcm2020_S_1":
                        {
                            strID = "AS_ISSUE_D";
                            strKey = "issue_seq";
                        }
                        break;
                    case "w_qcm2020_S_3":
                        {
                            strID = "AS_ISSUE_W";
                            strKey = "work_seq";
                        }
                        break;
                    case "w_qcm2020_S_5":
                        {
                            strID = "AS_ISSUE_P";
                            strKey = "part_seq";
                        }
                        break;
                    default:
                        continue;
                }
                int iKey = 0;
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                    {
                        if (iKey == 0)
                        {
                            try
                            {
                                objUpdate.objDr = (new cDBQuery(
                                                        ruleQuery.INLINE,
                                                        "SELECT dbo.FN_CREATEKEY('" + strID + "','" +
                                                            DATA.getValue(iAry, iRow, "issue_no") + "')"
                                                    )).retrieveQuery(objUpdate.objCon);
                                if (objUpdate.objDr.Read())
                                {
                                    iKey = Convert.ToInt32(objUpdate.objDr[0]);
                                }
                                objUpdate.objDr.Close();
                            }
                            catch (SqlException ex)
                            {
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
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>(
                                                    codeProcessed.ERR_PROCESS,
                                                    "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                        }
                        DATA.setValue(iAry, iRow, strKey, Convert.ToString(iKey++));
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
