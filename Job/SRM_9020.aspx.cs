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

public partial class JOB_SRM_9020 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region Mail() : Inform by eMail

    /// <summary>
    /// Mail() : Inform by eMail
    ///     : Create Report File & Inform by eMail
    ///     : input
    ///         - DATA : Query and Input / Output Parameter
    ///     : output 
    ///         - success : Result (entityNameValue)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Mail(cProcedureData DATA)
    {
        string strReturn = string.Empty;

        // Create Message.        
        SqlConnection objCon = null;
        SqlDataReader objDr = null;
        try
        {
            string strPath = HttpContext.Current.Server.MapPath("..") + "/Files/SRM/Report/";
            StreamWriter objIO = new StreamWriter(strPath + "20120202" + ".html", false, System.Text.Encoding.UTF8);

            string strBody =
                  "<html><head>"
                + "<style>"
                + "table { font-size:9pt; font-family:굴림체; color:#282E31; }"
                + "</style>"
                + "</head>"
                + "<body bgcolor=white text=black link=blue vlink=purple alink=red>"

                + "<table border=1 cellspacing=0 bordercolor=#FFFFFF bordercolordark=#FFFFFF bordercolorlight=#CFCAFF cols=45>"

                + "<colgroup>"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "</colgroup>";
            objIO.WriteLine(strBody);

            #region connect to DB.

            //  connect to DB.
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

            #region create Contents.

            int iRows = 0;
            string[] strOrders = new string[1000];
            try
            {
                string strQuery = string.Format(@"
                    SELECT
	                     A.ord_no
                    FROM SM_ORDER A
                    WHERE A.pstat < '2'
                    ORDER BY A.due_ymd
                    "/*,
                    strKey*/
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                while (objDr.Read())
                {
                    strOrders[iRows++] = objDr[0].ToString();
                }
                objDr.Close();

                if (iRows == 0)
                    throw new Exception("해당 데이터를 찾을 수 없습니다.");
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "대상 데이터 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            try
            {
                strBody =
                        "<tr>"
                    + "<td colspan=45 width=800 height=48 align=center valign=middle bgcolor=#DBE6FF>"
                    + "<font face=굴림체>" + "◈  프로젝트 납기표 ◈" + "</font>"
                    + "</td>"
                    + "</tr>";
                objIO.WriteLine(strBody);

                for (int iAry = 0; iAry < iRows; iAry++)
                {
                    string strQuery = string.Format(@"
                        SELECT
	                         A.ord_no
	                        ,A.prod_nm
	                        ,A.prod_type
	                        ,dbo.fn_getName('ZCODE','ISCM29',A.cust_cd) AS cust_nm
	                        ,A.cust_line
	                        ,A.cust_proc
	                        ,dbo.TO_CHAR(A.due_ymd, 'yyyy-mm-dd') AS due_ymd
                        FROM SM_ORDER A
                        WHERE A.ord_no = '{0}'
                        ORDER BY A.due_ymd
                        ",
                        strOrders[iAry]
                    );
                    objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                    string strProduct = string.Empty,
                           strType = string.Empty,
                           strCustomer = string.Empty,
                           strDate = string.Empty;
                    if (objDr.Read())
                    {
                        strProduct = objDr["prod_nm"].ToString();
                        strType = objDr["prod_type"].ToString();
                        strCustomer = objDr["cust_nm"] + " / " + objDr["cust_line"] + " / " + objDr["cust_proc"];
                        strDate = objDr["due_ymd"].ToString();
                    }
                    else
                        throw new Exception
                            ("제조 데이터를 찾을 수 없습니다.");
                    objDr.Close();

                    strQuery = string.Format(@"
                        SELECT 
	                          part_cd
                            , MAX(part_nm) AS part_nm
                            , MAX(supp_nm) AS supp_nm
                            , SUM(part_qty) AS part_qty
                            , MIN(part_dt) AS part_dt
                            , MAX(plan_dt_to) AS plan_dt
                            ,ISNULL(CAST(DATEDIFF(DAY, MIN(part_dt), MAX(plan_dt_to)) AS VARCHAR), '&nbsp;') AS dt_diff
                        FROM SM_BOM_STAT
                        WHERE ord_no = {0}
                        AND delay_yn LIKE {1}
                        AND in_yn LIKE {2}
                        GROUP BY part_cd, supp_cd
                        ORDER BY MIN(part_dt), part_cd
                        ",
                        strOrders[iAry]
                    );
                    objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                    int iRow = 0;
                    while (objDr.Read())
                    {
                        if (iRow == 0)
                        {
                            strBody =
                                  "<tr>"
                                + "<td colspan=45>"
                                + "<div><hr /></div>"
                                + "</td>"
                                + "</tr>"

                                + "<tr>"
                                + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "제품명" + "</font>"
                                + "</td>"
                                + "<td colspan=21 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                                + "<font face=굴림체>" + "&nbsp;&nbsp;" + strProduct + "</font>"
                                + "</td>"
                                + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "제품유형" + "</font>"
                                + "</td>"
                                + "<td colspan=10 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                                + "<font face=굴림체>" + "&nbsp;&nbsp;" + strType + "</font>"
                                + "</td>"
                                + "</tr>"

                                + "<tr>"
                                + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "고객사" + "</font>"
                                + "</td>"
                                + "<td colspan=21 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                                + "<font face=굴림체>" + "&nbsp;&nbsp;" + strCustomer + "</font>"
                                + "</td>"
                                + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "납기일" + "</font>"
                                + "</td>"
                                + "<td colspan=10 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                                + "<font face=굴림체>" + "&nbsp;&nbsp;" + strDate + "</font>"
                                + "</td>"
                                + "</tr>"

                                + "<tr>"
                                + "<td colspan=10 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "협력사명" + "</font>"
                                + "</td>"
                                + "<td colspan=20 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "품목명" + "</font>"
                                + "</td>"
                                + "<td colspan=5 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "생산요청" + "</font>"
                                + "</td>"
                                + "<td colspan=5 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "납기예정" + "</font>"
                                + "</td>"
                                + "<td colspan=5 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                                + "<font face=굴림체>" + "차이" + "</font>"
                                + "</td>"
                                + "</tr>";
                            objIO.WriteLine(strBody);
                        }
                        strBody =
                              "<tr>"
                            + "<td colspan=12 height=24 align=left valign=middle>"
                            + "<font face=굴림체 color=" + objDr["color"] + ">" + objDr["supp_nm"] + "</font>"
                            + "</td>"
                            + "<td colspan=18 height=24 align=left valign=middle>"
                            + "<font face=굴림체 color=" + objDr["color"] + ">" + objDr["part_nm"] + "</font>"
                            + "</td>"
                            + "<td colspan=5 height=24 align=center valign=middle>"
                            + "<font face=굴림체 color=" + objDr["color"] + ">" + objDr["part_dt"] + "</font>"
                            + "</td>"
                            + "<td colspan=5 height=24 align=center valign=middle>"
                            + "<font face=굴림체 color=" + objDr["color"] + ">" + objDr["plan_dt"] + "</font>"
                            + "</td>"
                            + "<td colspan=5 height=24 align=center valign=middle>"
                            + "<font face=굴림체 color=" + objDr["color"] + ">"
                            //+ ((objDr["dt_diff"].ToString() == "0" || objDr["dt_diff"].ToString() == "&nbsp;") ? "" : objDr["delay_yn"])
                            + objDr["dt_diff"]
                            + "</font>"
                            + "</td>"
                            + "</tr>";
                        objIO.WriteLine(strBody);

                        iRow++;
                    }
                    objDr.Close();

                    /*
                    if (iRow > 0)
                    {
                        strBody =
                              "<tr>"
                            + "<td colspan=45 height=12 align=left valign=middle bgcolor=#FFFFFF>"
                            + "<font face=굴림체>" + "&nbsp;" + "</font>"
                            + "</td>"
                            + "</tr>";
                        objIO.WriteLine(strBody);
                    }
                    */
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "납기 데이터 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "출력물 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            strBody =
                /*"<tr>"
              + "<td colspan=45 height=48 align=left valign=middle bgcolor=#FFFFFF>"
              + "<font face=굴림체>" + "&nbsp;" + "</font>"
              + "</td>"
              + "</tr>"*/

                  "</table>"
                + "</body></html>";
            objIO.WriteLine(strBody);

            objIO.Close();

            strReturn = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.SUCCESS,
                                "정상 처리되었습니다.")
                        );
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            strReturn = ex.Message;

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            if (objDr != null)
                objDr.Close();
            if (objCon != null)
                objCon.Close();

            #endregion
        }

        // Inform Message.
        entityNameValue objResult = null;
        cProcedure objProcedure = new cProcedure();
        try
        {
            #region initialize to Call.

            // initialize to Call.
            //
            objProcedure.initialize(false);
            objProcedure.objCmd.CommandTimeout = 60;

            #endregion

            #region call Procedure.

            // call Procedure.
            //
            objResult = objProcedure.call(DATA);

            #endregion

            #region normal Closing.

            // normal Closing.
            //
            objProcedure.close();
            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<entityNameValue>(
                                    codeProcessed.SUCCESS,
                                    objResult)
                            );

            #endregion
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
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
            objProcedure.release();

            #endregion
        }

        return strReturn;
    }

    #endregion
}


