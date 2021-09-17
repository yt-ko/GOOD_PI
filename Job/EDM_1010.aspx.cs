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

public partial class JOB_EDM_1010 : System.Web.UI.Page
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

            // Sub 및 Detail Record에 Master Key 값 설정
            string sMasterKey = ""; 
            
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                if (DATA.getObject(iAry).getQuery() == "EDM_1010_M_2")
                { // 폴더 추가 시 폴더 ID 생성
                    for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                    {
                        if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                        {
                            sMasterKey = getNewKey("EDM");
                            DATA.getObject(iAry).getRow(iRow).setValue("folder_id", sMasterKey);
                        }
                    }
                }
                else if (DATA.getObject(iAry).getQuery() == "EDM_1010_S_1") //Folder 권한
                {
                    int nSeq = 0;
                    for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                    {
                        if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                        {
                            sMasterKey = DATA.getValue(iAry, iRow, "folder_id");
                            if (nSeq != 0) nSeq++;
                            else nSeq = Convert.ToInt32(getNewSeq(objUpdate, "EDM_FOLDER_A", sMasterKey));
                            DATA.setValues("auth_seq", nSeq.ToString());
                        }
                    }
                }
                else if (DATA.getObject(iAry).getQuery() == "EDM_1010_S_2") //Folder 알람메일 수신자
                {
                    int nSeq = 0;
                    for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                    {
                        if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                        {
                            sMasterKey = DATA.getValue(iAry, iRow, "folder_id");
                            if (nSeq != 0) nSeq++;
                            else nSeq = Convert.ToInt32(getNewSeq(objUpdate, "EDM_FOLDER_M", sMasterKey));
                            DATA.setValues("mail_seq", nSeq.ToString());
                        }
                    }
                }
            }
            //---------------------------------------------------------------------------

            #endregion

            #region process Saving.

            // process Saving.
            objUpdate.beginTran();
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                lstSaved.Add( objUpdate.process(DATA.getObject(iAry), DATA.getUser()) );
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

    private static string getNewKey(string _KeyType)
    {
        cProcedure objProcedure = new cProcedure();
        // initialize to Call.
        //
        objProcedure.initialize();
        try
        {
            string strSQL = "SP_KEYGEN_PLM";
            objProcedure.objCmd.CommandText = strSQL;
            objProcedure.objCmd.Parameters.AddWithValue("@KeyType", _KeyType);
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
        return strKey;
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
