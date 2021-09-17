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

public partial class Job_DLG_SUPPLIER_ADD : System.Web.UI.Page
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
            string sUserId = HttpUtility.UrlDecode(cFirst.getFirst().getValue("user_id"));
            if (cFirst.QUERY == "w_pom9010_S_1" && cFirst.getFirst().getType() == typeQuery.INSERT)
            {
                string strKey = string.Empty;
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "sp_SYS_createSUPP";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.Add("@user_id", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.Parameters["@user_id"].Value = HttpUtility.UrlDecode(cFirst.getFirst().getValue("user_id"));
                    objProcedure.objCmd.Parameters.AddWithValue("@user_nm", HttpUtility.UrlDecode(cFirst.getFirst().getValue("user_nm")));
                    objProcedure.objCmd.Parameters.AddWithValue("@user_pw", HttpUtility.UrlDecode(cFirst.getFirst().getValue("user_pw")));
                    objProcedure.objCmd.Parameters.AddWithValue("@rgst_no", HttpUtility.UrlDecode(cFirst.getFirst().getValue("rgst_no")));
                    objProcedure.objCmd.Parameters.AddWithValue("@prsdnt_nm", HttpUtility.UrlDecode(cFirst.getFirst().getValue("prsdnt_nm")));
                    objProcedure.objCmd.Parameters.AddWithValue("@tel_no", HttpUtility.UrlDecode(cFirst.getFirst().getValue("tel_no")));
                    objProcedure.objCmd.Parameters.AddWithValue("@fax_no", HttpUtility.UrlDecode(cFirst.getFirst().getValue("fax_no")));
                    objProcedure.objCmd.Parameters.AddWithValue("@zip_no", HttpUtility.UrlDecode(cFirst.getFirst().getValue("zip_no")));
                    objProcedure.objCmd.Parameters.AddWithValue("@addr1", HttpUtility.UrlDecode(cFirst.getFirst().getValue("addr1")));
                    objProcedure.objCmd.Parameters.AddWithValue("@addr2", HttpUtility.UrlDecode(cFirst.getFirst().getValue("addr2")));
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
                                        "협력사를 등록할 수 없습니다.\n- " + ex.Message)
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
                                        "협력사 등록 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                if (objProcedure.objCmd.Parameters["@rtn_no"].Value.ToString() == "0")
                {
                    strKey = sUserId;
                    DATA.setValues("user_id", strKey);
                    // EDM_SVM은 SP에 의해 생성/저장 되었으므로 저장객체 제거
                    DATA.OBJECTS.RemoveAt(0);

                    cSavedData cSaved = new cSavedData(cFirst.getQuery());
                    cSaved.addKey("user_id", strKey);
                    lstSaved.Add(cSaved);
                }
                else
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_PROCESS,
                                        objProcedure.objCmd.Parameters["@rtn_msg"].Value.ToString())
                            )
                        );
                }

            }
            //---------------------------------------------------------------------------
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                if (DATA.getObject(iAry).getQuery() != "w_pom9010_D_1")
                    continue;

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
                                                        "SELECT dbo.FN_CREATEKEY('ZUSERINFO_D','" +
                                                            DATA.getValue(iAry, iRow, "user_id") + "')"
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
                        DATA.setValue(iAry, iRow, "user_seq", Convert.ToString(iKey++));
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

