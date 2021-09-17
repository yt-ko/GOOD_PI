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

public partial class Job_SRM_OpenSrc_Edit : System.Web.UI.Page
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
            try
            {
                if (DATA.getFirst().getQuery() == "SRM_OpenSrc_Comp"
                    && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
                {
                    DATA.implementValues(
                                "prop_id",
                                "SELECT dbo.FN_CREATEKEY('SRM_OpenSrc','1')",
                                objUpdate.objCon);
                }
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
            //---------------------------------------------------------------------------

            #endregion

            #region process Saving.

            // process Saving.
            //
            objUpdate.beginTran();
            string nSeq = DATA.getObject(0).getValue(0, "prop_id");
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                if (DATA.getObject(iAry).getQuery() != "SRM_OpenSrc_Comp")
                {
                    if (DATA.getObject(iAry).getQuery() != "SYS_File_Edit")
                    {
                        for (int j = 0; j < DATA.getObject(iAry).getSize(); j++)
                        {
                            if (nSeq != DATA.getObject(iAry).getValue(j, "prop_id"))
                                DATA.getObject(iAry).setValue(j, "prop_id", nSeq);

                        }
                    }
                    else
                    {
                        for (int j = 0; j < DATA.getObject(iAry).getSize(); j++)
                        {
                            if (nSeq != DATA.getObject(iAry).getValue(j, "data_seq"))
                                DATA.getObject(iAry).setValue(j, "data_seq", nSeq);

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
