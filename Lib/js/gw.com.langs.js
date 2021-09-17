//------------------------------------------
// API about Common Language Processing.
//                Created by JJJ GoodWare (2020.01)
//------------------------------------------

var gw_com_langs = {

    // variable.
    v_Langs: {
        row: [
            { kr: "", en: "", vn: "" }
, { kr: "2년전매출액", en: "Sales 2 years ago", vn: "" }
, { kr: "3년전매출액", en: "Sales 3 years ago", vn: "" }
, { kr: "Competitiveanalysis(경쟁사제품비교)", en: "Competitive analysis", vn: "" }
, { kr: "E-Mail", en: "E-Mail", vn: "E-Mail" }
, { kr: "Functionaltestingreport(기능평가자료)", en: "Functional testing report", vn: "" }
, { kr: "LotNo.", en: "Lot No.", vn: "Lot No." }
, { kr: "Nonfunctionaltestingreport(비기능평가자료)", en: "Non functional testing report", vn: "" }
, { kr: "PO수량", en: "PO Qty", vn: "Số lượng PO" }
, { kr: "TrackingNo.", en: "Tracking No.", vn: "Tracking No." }
, { kr: "가능", en: "Possible", vn: "Khả năng" }
, { kr: "개인정보처리방침", en: "Privacy Policy", vn: "" }
, { kr: "거래유형", en: "Transaction type", vn: "" }
, { kr: "건물면적", en: "Building area", vn: "" }
, { kr: "공지내용", en: "Notice Contents", vn: "Nội dung" }
, { kr: "공지사항", en: "Regist Notice", vn: "Đăng ký Nội dung" }
, { kr: "공지사항관리", en: "Manage Notice", vn: "Hiện trạng Nội dung" }
, { kr: "공지사항조회", en: "Regist Notice", vn: "Truy vấn Đăng ký Nội dung" }
, { kr: "공지일자", en: "Send DT", vn: "Ngày gửi" }
, { kr: "공지자", en: "Sender", vn: "Người gửi" }
, { kr: "구분", en: "Type", vn: "Phân loại" }
, { kr: "규격", en: "Item Spec", vn: "Quy cách" }
, { kr: "금액", en: "Amount", vn: "Số tiền" }
, { kr: "기업명", en: "Company name", vn: "" }
, { kr: "기업현황", en: "Company status", vn: "" }
, { kr: "기업형태", en: "Enterprise form", vn: "" }
, { kr: "기타", en: "Others", vn: "Khác" }
, { kr: "납기", en: "Due Date", vn: "Giao hàng" }
, { kr: "납기등록", en: "Register Delivery Plan", vn: "Đăng ký kế hoạch giao hàng" }
, { kr: "납기미등록", en: "Not Planed", vn: "Chưa đăng ký giao hàng" }
, { kr: "납기요구일", en: "Requested Date", vn: "Ngày yêu cầu giao hàng" }
, { kr: "납품", en: "Delivery", vn: "Giao hàng" }
, { kr: "납품가능일", en: "Possible Date", vn: "Ngày dự kiến giao hàng" }
, { kr: "납품등록", en: "Register Delivery", vn: "Đăng ký giao hàng" }
, { kr: "납품상태", en: "Delivery Status", vn: "Trạng thái giao hàng" }
, { kr: "납품현황", en: "List of Delivery", vn: "Hiện trạng giao hàng" }
, { kr: "납품서", en: "Statement of Delivery", vn: "Phiếu giao hàng" }
, { kr: "내역", en: "Detail", vn: "Chi tiết" }
, { kr: "다운로드", en: "Download", vn: "Download" }
, { kr: "단가", en: "Price", vn: "Đơn giá" }
, { kr: "단위", en: "UM", vn: "Đơn vị" }
, { kr: "닫기", en: "Close", vn: "Đóng" }
, { kr: "담당자", en: "Clerk", vn: "Người phụ trách" }
, { kr: "담당자TEL", en: "Person in charge TEL", vn: "" }
, { kr: "담당자명", en: "Person in charge", vn: "" }
, { kr: "대표", en: "Chief", vn: "Đại diện " }
, { kr: "대표자명", en: "Chief Name", vn: "Tên người đại diện" }
, { kr: "동의", en: "Agree", vn: "" }
, { kr: "등록", en: "Register", vn: "Đăng ký" }
, { kr: "등록일시", en: "Register DT", vn: "Thời gian đăng ký" }
, { kr: "등록자", en: "Register", vn: "Người đăng ký" }
, { kr: "라벨", en: "Label", vn: "Label" }
, { kr: "로그아웃", en: "Logout", vn: "Đăng xuất" }
, { kr: "로그인", en: "Login", vn: "Login" }
, { kr: "로그인ID", en: "Login ID", vn: "ID đăng nhập" }
, { kr: "만료일자", en: "Expiration DT", vn: "Ngày kết thúc" }
, { kr: "명", en: "Persons", vn: "" }
, { kr: "미납", en: "Not Delivery", vn: "Chưa giao hàng" }
, { kr: "미납품", en: "Not DLV Item", vn: "Chưa giao hàng" }
, { kr: "미등록", en: "Not Regist", vn: "Chưa đăng ký" }
, { kr: "미입고", en: "Not In", vn: "Chưa nhập kho" }
, { kr: "미준수", en: "Out of Due", vn: "Chưa tuân thủ" }
, { kr: "미준수수량", en: "Unalbe Qty", vn: "Số lượng chưa tuân thủ" }
, { kr: "미확인", en: "Not Checked", vn: "Chưa xác nhận" }
, { kr: "발주", en: "PO", vn: "Đơn đặt hàng" }
, { kr: "발주번호", en: "PO No.", vn: "Số đơn đặt hàng" }
, { kr: "발주번호(PO번호)단위로납품등록하세요", en: "", vn: "Hãy đăng ký giao hàng theo số đơn đặt hàng (Số PO)" }
, { kr: "발주서조회", en: "PO List", vn: "Truy vấn đơn đặt hàng" }
, { kr: "발주일자", en: "PO Date", vn: "Ngày đơn đặt hàng" }
, { kr: "백만원", en: " $", vn: "" }
, { kr: "변경", en: "Change", vn: "Thay đổi" }
, { kr: "본사전화번호", en: "Head office phone number", vn: "" }
, { kr: "본사주소", en: "Headquarter Address", vn: "" }
, { kr: "부서", en: "Department", vn: "Bộ phận" }
, { kr: "비고", en: "Remark", vn: "Ghi chú" }
, { kr: "비밀번호", en: "Password", vn: "Mật khẩu" }
, { kr: "비밀번호초기화", en: "Initiate Password", vn: "Khởi tạo mật khẩu" }
, { kr: "사업자등록번호", en: "Register No.", vn: "Register No." }
, { kr: "사용", en: "Use", vn: "Sử dụng" }
, { kr: "사용자명", en: "User Name", vn: "Tên người dùng" }
, { kr: "삭제", en: "Delete", vn: "Delete" }
, { kr: "상세", en: "Detail", vn: "Chi tiết" }
, { kr: "서비스안내", en: "Service Information", vn: "" }
, { kr: "선택", en: "Select", vn: "Chọn" }
, { kr: "설립일", en: "Date of establishment", vn: "" }
, { kr: "성릉평가자료보유현황", en: "Current status of performance evaluation data", vn: "" }
, { kr: "수량", en: "Qty", vn: "Số lượng" }
, { kr: "수정", en: "Edit", vn: "Sửa" }
, { kr: "순번", en: "No.", vn: "" }
, { kr: "시스템보유현황", en: "System possession status", vn: "" }
, { kr: "신규작성", en: "Create new", vn: "" }
, { kr: "▶신규작성", en: "▶ Create new", vn: "" }
, { kr: "신규제안", en: "New offer", vn: "" }
, { kr: "신용등급", en: "Credit rating", vn: "" }
, { kr: "실용실안현황", en: "Utility model status", vn: "" }
, { kr: "실행", en: "Run", vn: "Thực hiện" }
, { kr: "업체정보", en: "Company information", vn: "" }
, { kr: "엑셀", en: "Excel", vn: "Excel" }
, { kr: "연구개발인력", en: "R&D personnel", vn: "" }
, { kr: "완료", en: "End", vn: "Hoàn thành" }
, { kr: "우편번호", en: "Addr No.", vn: "Mã bưu điện" }
, { kr: "원산지", en: "Origin", vn: "" }
, { kr: "이력보기", en: "View History", vn: "" }
, { kr: "인수일자", en: "Received Date", vn: "Ngày nhận" }
, { kr: "인수자", en: "Receiver", vn: "Người nhận" }
, { kr: "인증보유현황", en: "Status of certification", vn: "" }
, { kr: "일괄생성", en: "Auto Create", vn: "Tạo đồng loạt" }
, { kr: "일시", en: "DateTime", vn: "Thời gian" }
, { kr: "일자", en: "Date", vn: "Ngày tháng" }
, { kr: "임직원수", en: "Number of employees", vn: "" }
, { kr: "입고", en: "End", vn: "Nhập kho" }
, { kr: "자가/임차", en: "Self/Lease", vn: "" }
, { kr: "자기자본비율", en: "Equity capital ratio", vn: "" }
, { kr: "저장", en: "Save", vn: "Lưu" }
, { kr: "적기", en: "In Due", vn: "Thích hợp" }
, { kr: "전송일시", en: "Send DT", vn: "Thời gian chuyển hàng" }
, { kr: "전화", en: "Telephone", vn: "Điện thoại" }
, { kr: "전화번호", en: "Tel No.", vn: "Số điện thoại" }
, { kr: "정보", en: "Information", vn: "Thông tin" }
, { kr: "정보변경", en: "Change Information", vn: "Thay đổi thông tin" }
, { kr: "정상", en: "Normal", vn: "Thông thường" }
, { kr: "정상", en: "Normal", vn: "Thông thường" }
, { kr: "제목", en: "Title", vn: "Tiêu đề" }
, { kr: "제안내용", en: "Suggestion contents", vn: "" }
, { kr: "제안내용", en: "Suggestion content", vn: "" }
, { kr: "제안부품", en: "Suggested parts", vn: "" }
, { kr: "제안유형", en: "Proposal type", vn: "" }
, { kr: "제안제목", en: "Proposal title", vn: "" }
, { kr: "제안품목", en: "Suggested Items", vn: "" }
, { kr: "제출", en: "Submission", vn: "" }
, { kr: "제출", en: "Submission", vn: "" }
, { kr: "조회", en: "Retrieve", vn: "Truy vấn" }
, { kr: "주문대비납품현황", en: "List of PO vs Delivery", vn: "Hiện trạng giao hàng theo đơn đặt hàng" }
, { kr: "주소", en: "Address", vn: "Địa chỉ" }
, { kr: "주요거래처(1)", en: "Major Customers (1)", vn: "" }
, { kr: "주요거래처(2)", en: "Major Customers (2)", vn: "" }
, { kr: "주요거래처(3)", en: "Major Customers (3)", vn: "" }
, { kr: "지연", en: "Late", vn: "Trì hoãn" }
, { kr: "직위", en: "Position", vn: "" }
, { kr: "직전년도매출액", en: "Sales of the previous year", vn: "" }
, { kr: "직책", en: "Job", vn: "Chức vụ" }
, { kr: "진행", en: "Ing", vn: "Đang tiến hành" }
, { kr: "첨부파일", en: "Attached File", vn: "File đính kèm" }
, { kr: "첨부파일", en: "Attachments", vn: "" }
, { kr: "추가", en: "Add New", vn: "Add New" }
, { kr: "출력", en: "Print", vn: "In" }
, { kr: "출력일시", en: "Print DT", vn: "Thời gian in" }
, { kr: "취소", en: "Cancel", vn: "Hủy bỏ" }
, { kr: "취소포함", en: "with Cenceled", vn: "Bao gồm hủy bỏ" }
, { kr: "특허/실용실안보유현황", en: "Current status of patents/utilities", vn: "" }
, { kr: "특허보유현황", en: "Patent holding status", vn: "" }
, { kr: "파일명", en: "File Name", vn: "Tên File" }
, { kr: "파일설명", en: "File Descriontion", vn: "Mô tả File" }
, { kr: "팩스", en: "Fax", vn: "Fax" }
, { kr: "팩스번호", en: "Fax No.", vn: "Số Fax" }
, { kr: "품명", en: "Item Name", vn: "Tên danh mục" }
, { kr: "품목", en: "ITEM", vn: "Danh mục" }
, { kr: "품목수", en: "Item Qty", vn: "Số lượng danh mục" }
, { kr: "품목코드", en: "Item Code", vn: "Code danh mục" }
, { kr: "품질관리인력", en: "Quality management personnel", vn: "" }
, { kr: "품질인증현황", en: "Quality Certification Status", vn: "" }
, { kr: "품질조직", en: "Quality organization", vn: "" }
, { kr: "해당분야업력", en: "Field work experience", vn: "" }
, { kr: "핸드폰번호", en: "Cellphone No.", vn: "Điện thoại di động" }
, { kr: "현황", en: "Report", vn: "Hiện trạng" }
, { kr: "협력사", en: "Supplier", vn: "Nhà cung cấp" }
, { kr: "협력사등록", en: "Nhà cung cấp Đăng ký", vn: "Regist Supplier" }
, { kr: "협력사명", en: "Supplier Name", vn: "Tên nhà cung cấp" }
, { kr: "협력사코드", en: "Supplier Code", vn: "Mã nhà cung cấp" }
, { kr: "확인", en: "Checked", vn: "Đã xác nhận" }
, { kr: "확인일시", en: "Check Date", vn: "Thời gian xác nhận" }
, { kr: "환경인증현황", en: "Environmental certification status", vn: "" }
, { kr: "회사", en: "Company", vn: "Công ty " }
, { kr: "명", en: "Persons", vn: "" }
, { kr: "평", en: "m²", vn: "" }
, { kr: "신규거래제안프로세스안내", en: "Guide to the new transaction proposal process", vn: "" }
, { kr: "사용권한이없습니다.", en: "You do not have permission.", vn: "" }
, { kr: "신규거래제안이력", en: "New transaction proposal history", vn: "" }
, { kr: "신규거래제안", en: "New transaction proposal", vn: "" }
, { kr: "개인정보수집및이용에대한동의", en: "Consent to the collection and use of personal information", vn: "" }
, { kr: "법인", en: "Corporation", vn: "" }
, { kr: "개인", en: "Individual", vn: "" }
, { kr: "반도체", en: "Semiconductor", vn: "" }
, { kr: "디스플레이", en: "Display", vn: "" }
, { kr: "10년이상", en: "10 years or more", vn: "" }
, { kr: "5년이상", en: "More than 5 years", vn: "" }
, { kr: "5년미만", en: "Less thsn 5 years", vn: "" }
, { kr: "자가", en: "Possesive", vn: "" }
, { kr: "임차", en: "Rental", vn: "" }
, { kr: "해당없음", en: "Not applicable", vn: "" }
, { kr: "상용품", en: "Commercial supplies", vn: "" }
, { kr: "가공품", en: "Processed goods", vn: "" }
, { kr: "기타", en: "Etc", vn: "" }
, { kr: "국산", en: "Korea", vn: "" }
, { kr: "미국", en: "USA", vn: "" }
, { kr: "일본", en: "Japan", vn: "" }
, { kr: "중국", en: "China", vn: "" }
, { kr: "유럽", en: "Europe", vn: "" }
, { kr: "제조사", en: "Manufacturer", vn: "" }
, { kr: "대리점", en: "Agency", vn: "" }
, { kr: "보유", en: "Possesion", vn: "" }
, { kr: "미보유", en: "Not Held", vn: "" }
, { kr: "미동의", en: "Unacceptable", vn: "" }
, { kr: "적격", en: "Eligible", vn: "" }
, { kr: "부적격", en: "Ineligible", vn: "" }
//, { kr: "", en: "", vn: "" }
            //, { kr: "" }개인정보 수집 및 이용에 대한 동의
        ]
    },
    getLangs: function (arg) {
        if (gw_com_module.v_Session.CUR_LANG == "kr") return arg;
        if (arg == undefined || arg == "") return "";
        //var rtn = $.trim(src);
        var rtn = arg;
        var add = "";
        // Last ":" 제거 후 검색
        if (arg.indexOf(":", 0) == arg.length - 1) {
            add = ":"; rtn = arg.substring(0, arg.length -1);
        }
        // 공백 제거
        var src = rtn.replace(/ /gi, "");
        if (gw_com_module.v_Session.CUR_LANG == "en")
            $.each(this.v_Langs.row, function (i) {
                if (this.kr == src) {
                    rtn = this.en;
                    return;
                }
            });
        return rtn + add;
    },
    // get resource.
    //#region
    setLangs: function (type, args) {

        // When lang=kr -> return
        if (gw_com_module.v_Session.CUR_LANG == "kr") return "";

        switch (type) {
            case "buttonMenu":
                
                $.each(args.element, function () {
                    if (this.value != undefined)
                        this.value = gw_com_langs.getLangs($.trim(this.value));
                });
        
                break;
            case "formCreate":
                // Form Title
                if (args.title != undefined)
                    args.title = gw_com_langs.getLangs($.trim(args.title));
                // Field's Label Title & Value
                $.each(args.content.row, function (i) {
                    $.each(this.element, function (j) {
                        if (this.label != undefined && this.label.title != undefined) {
                            this.label.title = gw_com_langs.getLangs($.trim(this.label.title));
                        }
                        if (this.value != undefined) {
                            this.value = gw_com_langs.getLangs($.trim(this.value));
                        }
                        if (this.unit != undefined) {
                            this.unit = gw_com_langs.getLangs($.trim(this.unit));
                        }
                    });
                });
                /*
        // Set Languages : by JJJ at 2020.01
        if (gw_com_module.v_Session.CUR_LANG != "kr") {
            if (args.langs != undefined) {
                if (gw_com_module.v_Session.CUR_LANG == "vn")
                    args.title = args.langs.vn;
                else args.title = args.langs.en;
            }
        }

        $.each(args.content.row, function (i) {
            $.each(this.element, function (j) {
                if (gw_com_module.v_Session.CUR_LANG != "kr") {
                    if (this.label != undefined && this.label.langs != undefined) {
                        if (gw_com_module.v_Session.CUR_LANG == "vn")
                            this.label.title = this.label.langs.vn;
                        else this.label.title = this.label.langs.en;
                    }
                    if (this.value != undefined && this.langs != undefined) {
                        if (gw_com_module.v_Session.CUR_LANG == "vn")
                            this.value = this.langs.vn;
                        else this.value = this.langs.en;
                    }
                }
            });
        });
                */
                break;
            case "gridCreate":
                // Form Title
                if (args.title != undefined)
                    args.title = gw_com_langs.getLangs($.trim(args.title));

                $.each(args.element, function (j) {
                    if (this.header != undefined)
                        this.header = gw_com_langs.getLangs($.trim(this.header));
                });
                /*
        if (gw_com_module.v_Session.CUR_LANG != "kr") {
            if (args.langs != undefined) {
                if (gw_com_module.v_Session.CUR_LANG == "vn")
                    args.title = args.langs.vn;
                else args.title = args.langs.en;
            }
        }

        $.each(args.element, function (i) {
            // Set Languages : by JJJ at 2020.01
            if (gw_com_module.v_Session.CUR_LANG != "kr") {
                if (this.header != undefined && this.langs != undefined) {
                    if (gw_com_module.v_Session.CUR_LANG == "vn")
                        this.header = this.langs.vn;
                    else this.header = this.langs.en;
                }
            }

                */
                break;
            case "launchTab":
                // TabPage Title
                $.each(args.target, function () {
                    if (this.title != undefined) 
                        this.title = gw_com_langs.getLangs($.trim(this.title));
                });
                break;

            default:
                return "";
        }

        return "";
    }
    //#endregion


};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//