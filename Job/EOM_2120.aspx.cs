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
using System.IO;

public partial class JOB_EOM_2120 : System.Web.UI.Page
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
        // check Argument.
        if (DATA.getSize() <= 0) return getErrMsg("PARAM", "");

        string strReturn = string.Empty;
        List<cSavedData> lstSaved = new List<cSavedData>();
        cUpdate objUpdate = new cUpdate();

        try
        {
            // initialize to Update.
            objUpdate.initialize(false);

            #region Customize.

            // Master Key
            if (DATA.getFirst().getQuery() == "EOM_2120_D_1" && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "EOM_PLAN");
                    objProcedure.objCmd.Parameters.Add("@NewKey", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                    objProcedure.objCmd.ExecuteNonQuery();
                    objProcedure.processTran(doTransaction.COMMIT);
                }
                catch (SqlException ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);
                    throw new Exception(getErrMsg("SQL", ex.Message));
                }
                catch (Exception ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);
                    throw new Exception(getErrMsg("PROCESS", ex.Message));
                }
                string strKey = objProcedure.objCmd.Parameters["@NewKey"].Value.ToString();
                DATA.setValues("plan_no", strKey);
            }
            // Detail Seq
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)   // Loop by Grid
            {
                // Set Key & Seq Column by Query ID
                string strKeyID = string.Empty;
                string strSeqCol = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "EOM_2120_D_2":
                        { strKeyID = "EOM_PLAN_D"; strSeqCol = "plan_seq"; } break;
                    default:
                        continue;
                }
                int iKey = 0;
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)   // Loop by Row
                {
                    if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                    {
                        if (iKey == 0)  // Only first rows
                        {
                            string sQry = string.Format("SELECT dbo.FN_CREATEKEY('{0}','{1}')", strKeyID, DATA.getValue(iAry, iRow, "plan_no"));
                            try
                            {
                                objUpdate.objDr = (new cDBQuery(ruleQuery.INLINE, sQry)).retrieveQuery(objUpdate.objCon);
                                if (objUpdate.objDr.Read()) iKey = Convert.ToInt32(objUpdate.objDr[0]);
                                objUpdate.objDr.Close();
                            }
                            catch (SqlException ex)
                            {
                                throw new Exception(getErrMsg("SQL", ex.Message + "\n" + sQry));
                            }
                            catch (Exception ex)
                            {
                                throw new Exception(getErrMsg("PROCESS", ex.Message + "\n" + sQry));
                            }
                        }
                        DATA.setValue(iAry, iRow, strSeqCol, Convert.ToString(iKey++));
                    }
                }
            }
            //---------------------------------------------------------------------------

            #endregion

            // process Saving.
            objUpdate.beginTran();
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                lstSaved.Add(objUpdate.process(DATA.getObject(iAry), DATA.getUser()));
            }

            objUpdate.close(doTransaction.COMMIT);
            strReturn = new JavaScriptSerializer().Serialize(new entityProcessed<List<cSavedData>>(codeProcessed.SUCCESS, lstSaved));
        }
        catch (Exception ex)
        {
            objUpdate.close(doTransaction.ROLLBACK);
            strReturn = new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS, ex.Message));
        }
        finally
        {
            objUpdate.release();
        }

        return strReturn;
    }

    private static string getErrMsg(string _ErrCode, string _ExMsg)
    {
        string sRtn = "";
        if (_ErrCode == "SQL") 
            sRtn = new JavaScriptSerializer().Serialize(
                       new entityProcessed<string>( codeProcessed.ERR_SQL, "Key를 생성할 수 없습니다.\n- " + _ExMsg));
        else if (_ErrCode == "PROCESS") 
            sRtn = new JavaScriptSerializer().Serialize(
                       new entityProcessed<string>( codeProcessed.ERR_PROCESS, "Key 생성 중에 오류가 발생하였습니다.\n- " + _ExMsg) );
        else if (_ErrCode == "PARAM")
            sRtn = new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(codeProcessed.ERR_PARAM, "잘못된 호출입니다.") );
        else sRtn = _ExMsg;

        return sRtn;

    }
    #endregion
}
