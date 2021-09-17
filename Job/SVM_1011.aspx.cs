using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Job_SVM_1011 : System.Web.UI.Page
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
            cSaveObject cFirst = DATA.getFirst();
            if (cFirst.getQuery() == "SVM_1011_1"
                && cFirst.getFirst().getType() == typeQuery.INSERT)
            {
                string strKey = string.Empty;
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "sp_EDM_createSVM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.Add("@doc_id", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.Parameters["@doc_id"].Value = HttpUtility.UrlDecode(cFirst.getFirst().getValue("doc_id"));
                    //objProcedure.objCmd.Parameters["@doc_id"].Direction = ParameterDirection.InputOutput;
                    //objProcedure.objCmd.Parameters.AddWithValue("@doc_id", HttpUtility.UrlDecode(cFirst.getFirst().getValue("doc_id")));
                    objProcedure.objCmd.Parameters.AddWithValue("@ver_no", HttpUtility.UrlDecode(cFirst.getFirst().getValue("ver_no")));
                    objProcedure.objCmd.Parameters.AddWithValue("@rmk", HttpUtility.UrlDecode(cFirst.getFirst().getValue("rmk")));
                    objProcedure.objCmd.Parameters.AddWithValue("@dept_area", HttpUtility.UrlDecode(cFirst.getFirst().getValue("dept_area")));
                    objProcedure.objCmd.Parameters.AddWithValue("@astat", HttpUtility.UrlDecode(cFirst.getFirst().getValue("astat")));
                    objProcedure.objCmd.Parameters.AddWithValue("@astat_usr", HttpUtility.UrlDecode(cFirst.getFirst().getValue("astat_usr")));
                    objProcedure.objCmd.Parameters.AddWithValue("@astat_dt", HttpUtility.UrlDecode(cFirst.getFirst().getValue("astat_dt")));
                    objProcedure.objCmd.Parameters.AddWithValue("@usr_id", HttpUtility.UrlDecode(DATA.getUser()));
                    objProcedure.objCmd.Parameters.Add("@rtn_no", SqlDbType.Int).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.Parameters.Add("@rtn_msg", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
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
                strKey = objProcedure.objCmd.Parameters["@doc_id"].Value.ToString();
                DATA.setValues("doc_id", strKey);
                // EDM_SVM은 SP에 의해 생성/저장 되었으므로 저장객체 제거
                DATA.OBJECTS.RemoveAt(0);

                cSavedData cSaved = new cSavedData(cFirst.getQuery());
                cSaved.addKey("doc_id", strKey);
                lstSaved.Add(cSaved);
            }
            //---------------------------------------------------------------------------

            #endregion

            #region process Saving.

            // process Saving.
            //
            if (DATA.getSize() > 0)
            {
                objUpdate.beginTran();
                for (int iAry = 0; iAry < DATA.getSize(); iAry++)
                {
                    lstSaved.Add(
                        objUpdate.process(DATA.getObject(iAry), DATA.getUser())
                    );
                }
                objUpdate.close(doTransaction.COMMIT);
            }

            #endregion

            #region normal Closing.

            // normal Closing.
            //
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
