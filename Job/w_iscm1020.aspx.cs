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

public partial class Job_w_iscm1020 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region Update() : Update Process (Client에서 저장 요청시 실행)

    /// <summary>
    /// Update() : Update Process (Client에서 저장 요청시 실행)
    ///     
    ///     Input 
    ///         : DATA - Client Data (cSaveData).
    ///     Output : string - 처리 결과 JSON type (cProcessed).
    /// </summary>
    [WebMethod]
    public static string Update(cSaveData DATA)
    {
        string strReturn = string.Empty;

        #region 1. Call Argument Check.

        // 1. Call Argument Check.
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

        cDBKey objKey = null;
        SqlConnection objCon = null;
        SqlTransaction objTran = null;
        SqlCommand objCmd = null;
        SqlDataReader objDr = null;
        try
        {
            #region 2. DB Connection Open.

            // 2. DB Connection Open.
            //
            try
            {
                objCon = new SqlConnection(
                                    ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
                objCon.Open();
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Database에 연결할 수 없습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion


            #region 3. Transaction Open & Query Command 생성.

            // 3. Transaction Open & Query Command 생성.
            //
            try
            {
                objTran = objCon.BeginTransaction();
                objCmd = new SqlCommand(string.Empty, objCon, objTran);
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Query Process를 시작할 수 없습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Query Process 시작 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region 4~8. Object Update 처리.

            // 4~8. Object Update 처리.
            //
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                #region 5. Saving Module 생성.

                // 5. Saving Module 생성.
                //
                cSave objProcess = new cSave(
                                        DATA.getObject(iAry),
                                        DATA.getObject(iAry).getQuery());

                #endregion

                #region 6. DB Column 정보 Mapping.

                // 6. DB Column 정보 Mapping.
                //
                try
                {
                    if (iAry == 0 &&
                        DATA.getObject(iAry).getFirst().getType() != typeQuery.DELETE)
                        objKey = objProcess.mapColumn(
                                            objCmd,
                                            objDr);
                    else
                        objProcess.mapColumn(
                                            objCmd,
                                            objDr);
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_SQL,
                                        "Column 정보를 Mapping할 수 없습니다.\n -" + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_PROCESS,
                                        "Column 정보 Mapping 중에 오류가 발생하였습니다.\n -" + ex.Message)
                            )
                        );
                }

                #endregion

                #region 7. DML 생성. (Insert/Update/Delete)

                // 7. DML 생성. (Insert/Update/Delete)
                //
                try
                {
                    objProcess.inlineQuery();
                }
                catch (Exception ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_PROCESS,
                                        "Query 생성 중에 오류가 발생하였습니다.\n -" + ex.Message)
                            )
                        );
                }

                #endregion

                #region 8. DML 실행. (Insert/Update/Delete)

                // 8. DML 실행. (Insert/Update/Delete)
                //
                try
                {
                    objProcess.executeSave(objCmd);
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.ERR_SQL,
                                    "Data 저장에 실패하였습니다.\n- (" + ex.Number + ") : " + ex.Message)
                                )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    "Data 저장에 실패하였습니다.\n- " + ex.Message)
                                )
                        );
                }

                #endregion
            }

            #endregion

            #region 9. Commit Transaction.

            // 9. Commit Transaction.
            //
            try
            {
                objTran.Commit();
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Query Process를 Commit할 수 없습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Query Procedss Commit 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<cDBKey>(
                                    codeProcessed.SUCCESS,
                                    objKey)
                            );
        }
        catch (Exception ex)
        {
            #region 10. Rollback Transaction.

            // 10. Rollback Transaction.
            //
            if (objTran != null)
                objTran.Rollback();

            #endregion

            strReturn = ex.Message;
        }
        finally
        {
            #region 11. Release Object.

            // 11. Release Object.
            //
            if (objDr != null)
                objDr.Close();
            if (objCon != null)
                objCon.Close();

            #endregion
        }

        return strReturn;
    }

    #endregion
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

