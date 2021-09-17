using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Job_w_srm1060 : System.Web.UI.Page
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
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    DATA.setValue(iAry, iRow, "dlvy_dt_1", string.IsNullOrEmpty(DATA.getValue(iAry, iRow, "dlvy_date_1")) ? "null" : DATA.getValue(iAry, iRow, "dlvy_date_1"));
                    DATA.setValue(iAry, iRow, "dlvy_dt_2", string.IsNullOrEmpty(DATA.getValue(iAry, iRow, "dlvy_date_2")) ? "null" : DATA.getValue(iAry, iRow, "dlvy_date_2"));
                    DATA.setValue(iAry, iRow, "dlvy_dt_3", string.IsNullOrEmpty(DATA.getValue(iAry, iRow, "dlvy_date_3")) ? "null" : DATA.getValue(iAry, iRow, "dlvy_date_3"));
                }
            }
            #endregion

            #region process Saving.

            // process Saving.
            //
            //objUpdate.beginTran();    // LinkedServer Update 시 Transaction 오류 발생으로 인해 주석처리함.
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
            //objUpdate.close(doTransaction.ROLLBACK);
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

