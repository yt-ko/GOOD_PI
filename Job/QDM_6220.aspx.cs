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

public partial class JOB_QDM_6220 : System.Web.UI.Page
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
            if (DATA.getFirst().getQuery() == "QDM_6220_M_1" && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "NCR-RQST");
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
                DATA.setValues("rqst_no", strKey);
            }
            //---------------------------------------------------------------------------
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strID = string.Empty;
                string strKey = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "QDM_6220_S_1":
                        {
                            strID = "QDM_ISSUE_D2";
                            strKey = "act_seq";
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
                                                            DATA.getValue(iAry, iRow, "rqst_no") + "')"
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
            string strKey = DATA.ARGUMENT.getValue("eccb_no");
            string strPath = HttpContext.Current.Server.MapPath("..") + "/Files/ECCB/Report/";
            StreamWriter objIO = new StreamWriter(strPath + strKey + ".html", false, System.Text.Encoding.UTF8);

            string strBody =
                  "<html><head>"
                + "<style>"
                + "table { font-size:9pt; font-family:굴림체; color:#282E31; }"
                + "</style>"
                + "</head>"
                + "<body bgcolor=white text=black link=blue vlink=purple alink=red>"
                + "<table border=1 cellspacing=0 bordercolor=#FFFFFF bordercolordark=#FFFFFF bordercolorlight=#CFCAFF cols=44>"
                + "<colgroup>"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
                + "<col width=15 />" + "<col width=15 />" + "<col width=15 />" + "<col width=15 />"
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

            try
            {
                string strQuery = string.Format(@"
                    SELECT 
                          A.meet_title
                        , SUBSTRING(A.meet_dt, 1, 4) + '-' + SUBSTRING(A.meet_dt, 5, 2) + '-' + SUBSTRING(A.meet_dt, 7, 2) AS meet_dt
                        , A.str_time
                        , D.dept_nm AS meet_dept
                        , A.meet_place
                        , ISNULL(REPLACE(REPLACE(A.meet_note, CHAR(13), '<br />&nbsp;&nbsp;'), CHAR(10), ''), '') AS meet_note
                    FROM EC_ECCB A
		            LEFT OUTER JOIN V_DEPT D ON D.dept_cd = A.mng_dept
		            WHERE eccb_no = '{0}'
                    ",
                    strKey
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                string strRemark = string.Empty;
                if (objDr.Read())
                {
                    strBody =
                          "<tr>"
                        + "<td colspan=44 width=595 height=24 align=center valign=middle>"
                        + "<font face=굴림체>" + "◈ ECCB 심의 회의록 ◈" + "</font>"
                        + "</td>"
                        + "</tr>"

                        + "<tr>"
                        + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                        + "<font face=굴림체>" + "회의제목" + "</font>"
                        + "</td>"
                        + "<td colspan=37 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["meet_title"] + "</font>"
                        + "</td>"
                        + "</tr>"

                        + "<tr>"
                        + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                        + "<font face=굴림체>" + "회의일자" + "</font>"
                        + "</td>"
                        + "<td colspan=18 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["meet_dt"] + "</font>"
                        + "</td>"
                        + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                        + "<font face=굴림체>" + "심의번호" + "</font>"
                        + "</td>"
                        + "<td colspan=12 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + strKey + "</font>"
                        + "</td>"
                        + "</tr>"

                        + "<tr>"
                        + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                        + "<font face=굴림체>" + "회의장소" + "</font>"
                        + "</td>"
                        + "<td colspan=18 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["meet_place"] + "</font>"
                        + "</td>"
                        + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                        + "<font face=굴림체>" + "주관부서" + "</font>"
                        + "</td>"
                        + "<td colspan=12 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["meet_dept"] + "</font>"
                        + "</td>"
                        + "</tr>";
                    objIO.WriteLine(strBody);

                    strRemark = objDr["meet_note"].ToString();
                }
                else
                    throw new Exception
                        ("해당 데이터를 찾을 수 없습니다.");
                objDr.Close();

                string strAttendee = string.Empty;
                strQuery = string.Format("SELECT MAX(seq) AS attendee FROM [fn_getECCBAttendee] ('{0}', '1')", strKey);
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                if (objDr.Read())
                {
                    strAttendee = objDr["attendee"].ToString();
                }
                else
                    throw new Exception
                        ("해당 데이터를 찾을 수 없습니다.");
                objDr.Close();

                strQuery = string.Format(@"
                    SELECT 
					      seq
					    , attend_dept1_nm, attend_emp1_nm
					    , attend_dept2_nm, attend_emp2_nm
					    , attend_dept3_nm, attend_emp3_nm
				    FROM [fn_getECCBAttendee] ('{0}', '1')
                    ",
                    strKey
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                int iRow = 0;
                while (objDr.Read())
                {
                    strBody =
                          "<tr>";
                    if (iRow == 0)
                        strBody = strBody +
                              "<td colspan=2 rowspan=" + strAttendee + " align=center valign=middle bgcolor=#DBE6FF>"
                            + "<font face=굴림체>" + "참<br /><br />석<br /><br />자" + "</font>"
                            + "</td>";
                    strBody = strBody +
                          "<td colspan=8 height=20 align=center valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + objDr["attend_dept1_nm"] + "</font>"
                        + "</td>"
                        + "<td colspan=6 height=20 align=center valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + objDr["attend_emp1_nm"] + "</font>"
                        + "</td>"
                        + "<td colspan=8 height=20 align=center valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + objDr["attend_dept2_nm"] + "</font>"
                        + "</td>"
                        + "<td colspan=6 height=20 align=center valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + objDr["attend_emp2_nm"] + "</font>"
                        + "</td>"
                        + "<td colspan=8 height=20 align=center valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + objDr["attend_dept3_nm"] + "</font>"
                        + "</td>"
                        + "<td colspan=6 height=20 align=center valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + objDr["attend_emp3_nm"] + "</font>"
                        + "</td>"
                        + "</tr>";
                    objIO.WriteLine(strBody);

                    iRow++;
                }
                objDr.Close();

                strBody =
                      "<tr>"
                    + "<td colspan=2 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                    + "<font face=굴림체>" + "NO." + "</font>"
                    + "</td>"
                    + "<td colspan=42 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                    + "<font face=굴림체>" + "심의 안건 및 협의 내용" + "</font>"
                    + "</td>"
                    + "</tr>";
                objIO.WriteLine(strBody);

                strQuery = string.Format(@"
                    SELECT
				          A.root_type
				        , A.ecr_no
				        , E.ecr_title
				        , E.ecr_emp_nm
				        , E.ecr_desc
				        , dbo.fn_getFullName('ZCODE','ECCB30',A.result_cd) AS result_nm 
				        , dbo.fn_getFullName('ZCODE','ECCB22',A.priority_cd) AS priority_nm 
				        , ISNULL(REPLACE(A.item_note, 'CRLF', '<br />&nbsp;&nbsp;'), '') AS item_note
				        , (select dept_nm from V_DEPT where dept_cd = A.act_dept1) AS act_dept1_nm
				        , (select emp_nm from V_EMP where emp_no = A.act_emp1) AS act_emp1_nm
				        , (select dept_nm from V_DEPT where dept_cd = A.act_dept2) AS act_dept2_nm
				        , (select emp_nm from V_EMP where emp_no = A.act_emp2) AS act_emp2_nm
			        FROM EC_ECCB_ITEM A
			        INNER JOIN V_ECR E ON E.ecr_no = A.ecr_no
			        WHERE eccb_no = '{0}'
                    ",
                    strKey
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                int iCount = 0,
                    iECO = 0, iCIP = 0, iHold = 0, iDrop = 0;
                while (objDr.Read())
                {
                    strBody =
                          "<tr>"
                        + "<td colspan=2 align=center valign=middle bgcolor=#DBE6FF>"
                        + "<font face=굴림체>" + (iCount + 1).ToString() + "</font>"
                        + "</td>"
                        + "<td colspan=42 height=20 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<table width=100% cellspacing=5>"

                        + "<tr>"
                        + "<td height=24 width=75 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;등록번호&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["ecr_no"] + " ( 제안자 : " + objDr["ecr_emp_nm"] + " )" + "</font>"
                        + "</td>"
                        + "</tr>"

                        + "<tr>"
                        + "<td height=24 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;제 안 명&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["ecr_title"] + "</font>"
                        + "</td>"
                        + "</tr>"

                        + "<tr>"
                        + "<td height=24 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;제안개요&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["ecr_desc"] + "</font>"
                        + "</td>"
                        + "</tr>"

                        + "<tr>"
                        + "<td height=24 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;심의결과&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["result_nm"] + "</font>"
                        + "</td>"
                        + "</tr>"

                        + "<tr>"
                        + "<td height=24 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;협의내용&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + objDr["item_note"] + "</font>"
                        + "</td>"
                        + "</tr>"

                        + "</table>"
                        + "</td>"
                        + "</tr>";
                    objIO.WriteLine(strBody);

                    iCount++;
                    switch (objDr["result_nm"].ToString())
                    {
                        case "ECO":
                            iECO++;
                            break;
                        case "CIP":
                            iCIP++;
                            break;
                        case "보류":
                            iHold++;
                            break;
                        case "기각":
                            iDrop++;
                            break;
                    }
                }
                objDr.Close();

                strBody =
                      "<tr>"
                    + "<td colspan=2 align=center valign=middle bgcolor=#DBE6FF>"
                    + "<font face=굴림체>" + "결<br /><br />론" + "</font>"
                    + "</td>"
                    + "<td colspan=42 height=20 align=left valign=middle bgcolor=#FFFFFF>"
                    + "<table width=100% cellspacing=5>"

                    + "<tr>"
                    + "<td height=24 width=75 align=center valign=middle bgcolor=#E0E0E0>"
                    + "<font face=굴림체>" + "&nbsp;&nbsp;심의안건&nbsp;&nbsp;" + "</font>"
                    + "</td>"
                    + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                    + "<font face=굴림체>" + "&nbsp;&nbsp;" + iCount.ToString() + " 건" + "</font>"
                    + "</td>"
                    + "</tr>";
                objIO.WriteLine(strBody);
                if (iECO > 0)
                {
                    strBody =
                          "<tr>"
                        + "<td height=24 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;ECO&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + iECO.ToString() + " 건" + "</font>"
                        + "</td>"
                        + "</tr>";
                    objIO.WriteLine(strBody);
                }
                if (iCIP > 0)
                {
                    strBody =
                          "<tr>"
                        + "<td height=24 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;CIP&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + iCIP.ToString() + " 건" + "</font>"
                        + "</td>"
                        + "</tr>";
                    objIO.WriteLine(strBody);
                }
                if (iHold > 0)
                {
                    strBody =
                          "<tr>"
                        + "<td height=24 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;보류&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + iHold.ToString() + " 건" + "</font>"
                        + "</td>"
                        + "</tr>";
                    objIO.WriteLine(strBody);
                }
                if (iDrop > 0)
                {
                    strBody =
                          "<tr>"
                        + "<td height=24 align=center valign=middle bgcolor=#E0E0E0>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;기각&nbsp;&nbsp;" + "</font>"
                        + "</td>"
                        + "<td height=24 align=left valign=middle bgcolor=#FFFFFF>"
                        + "<font face=굴림체>" + "&nbsp;&nbsp;" + iDrop.ToString() + " 건" + "</font>"
                        + "</td>"
                        + "</tr>";
                    objIO.WriteLine(strBody);
                }
                strBody =
                      "</table>"
                    + "</td>"
                    + "</tr>";
                objIO.WriteLine(strBody);

                strBody =
                      "<tr>"
                    + "<td colspan=44 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                    + "<font face=굴림체>" + "비고" + "</font>"
                    + "</td>"
                    + "</tr>"

                    + "<tr>"
                    + "<td colspan=44 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                    + "<font face=굴림체>" + "&nbsp;&nbsp;" + strRemark + "</font>"
                    + "</td>"
                    + "</tr>";
                objIO.WriteLine(strBody);

                strBody =
                      "<tr>"
                    + "<td colspan=7 height=24 align=center valign=middle bgcolor=#DBE6FF>"
                    + "<font face=굴림체>" + "첨부문서" + "</font>"
                    + "</td>"
                    + "<td colspan=37 height=24 align=left valign=middle bgcolor=#FFFFFF>"
                    + "<font face=굴림체>";
                objIO.WriteLine(strBody);

                strQuery = string.Format(@"
                    SELECT
				         file_nm
				        ,file_ext
				        ,file_desc
				        ,REPLACE('http://pi.ips.co.kr/' + SUBSTRING(file_path, CHARINDEX('Files\ECCB\Attach', file_path), LEN(file_path)), '\', '/') + file_id + '.' + file_ext AS file_path
			        FROM ZFILE A
			        WHERE data_key = '{0}'
                    ",
                    strKey
                );
                objDr = (new cDBQuery(
                            ruleQuery.INLINE,
                            strQuery
                        )).retrieveQuery(objCon);
                iRow = 0;
                while (objDr.Read())
                {
                    strBody =
                          ((iRow > 0) ? "<br />" : "")
                        + "&nbsp;&nbsp;<a href='" + objDr["file_path"] + "'>" + objDr["file_nm"] + "</a>";
                    objIO.WriteLine(strBody);

                    iRow++;
                }
                objDr.Close();

                strBody =
                      "</font>"
                    + "</td>"
                    + "</tr>"

                    + "<tr>"
                    + "<td colspan=44 height=48 align=left valign=middle bgcolor=#FFFFFF>"
                    + "<font face=굴림체>" + "&nbsp;" + "</font>"
                    + "</td>"
                    + "</tr>";
                objIO.WriteLine(strBody);
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "데이터 조회에 실패하였습니다.\n- " + ex.Message)
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
                  "</table>"
                + "</body></html>";
            objIO.WriteLine(strBody);

            objIO.Close();
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
