using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

//using System.Web.Script.Services;
//using System.Data;
//using System.Web.Configuration;
//using System.Text;
//using System.Collections;
//using System.Collections.Specialized;
//using System.Configuration;

public partial class Job_SYS_Notice_Edit : System.Web.UI.Page
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
            string keyCol = "nt_seq", keyCode = "ZNOTICE", keyNo = "";
            try
            {
                if (DATA.getFirst().getQuery() == "SYS_Notice_Edit")
                {
                    if (DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
                        keyNo = DATA.implementValues(keyCol, "SELECT dbo.FN_CREATEKEY('" + keyCode + "','1')", objUpdate.objCon);
                    else
                        keyNo = DATA.getObject(0).getValue(0, keyCol);
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(
                        new JavaScriptSerializer().Serialize( new entityProcessed<string>( codeProcessed.ERR_SQL, "Key를 생성할 수 없습니다.\n- " + ex.Message) )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                        new JavaScriptSerializer().Serialize( new entityProcessed<string>( codeProcessed.ERR_PROCESS, "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message) )
                    );
            }
            #endregion

            #region process Saving.
            //---------------------------------------------------------------------------
            objUpdate.beginTran();
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                // Set New Key No. into Sub Data
                if (!string.IsNullOrEmpty(keyNo))
                {
                    if (DATA.getObject(iAry).getQuery() == "w_sys2030_S_2")
                    {
                        for (int j = 0; j < DATA.getObject(iAry).getSize(); j++)
                        {
                            if (keyNo != DATA.getObject(iAry).getValue(j, keyCol))
                                DATA.getObject(iAry).setValue(j, keyCol, keyNo);
                        }
                    }
                }

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
