export default (email: string, code: string) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <style>
    body {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      padding: 0;
      color: #1e1e1e;
      background-color: #efeff0;
      font-family: "Nanum Gothic", "돋움", dotum, verdana, sans-serif;
    }

    .tableWarpper {
      width: 100%;
      table-layout: fixed;
      line-height: 25px;
    }

    .headerWrap > td {
      padding: 40px 20px;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
      background-color: #007bf1;
    }

    .contentWrap {
      background-color: #ffffff;
    }

    .footerWrap {
      background-color: #ffffff;
      font-size: 12px;
      color: #7e7e7e;
      line-height: 20px;
    }
    
    .footer-text {
      font-size: 12px;
      color: #7e7e7e;
      line-height: 20px;
    }

    span {
      color: #007bf1;
      font-weight: bold;
    }
  </style>
  <body>
    <table class="tableWarpper" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <table align="center" cellpadding="0" cellspacing="0" width="600">
            <!-- header -->
            <tr class="headerWrap">
              <td>국립소방연구원 임시 비밀번호 제공 안내</td>
            </tr>

            <!-- content -->
            <tr class="contentWrap">
              <td style="padding: 40px 30px 20px 30px">
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td
                      style="
                        padding-bottom: 40px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      국립소방연구원에서 고객님에게 발송한
                      이메일입니다.
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding-top: 20px;
                        line-height: 30px;
                        border-top: 2px solid #e6e6e6;
                      "
                    >
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td
                            width="30%"
                            style="font-size: 14px; padding-left: 10px"
                          >
                            국립소방연구원 계정
                          </td>
                          <td style="font-size: 14px; font-weight: bold">
                            ${email}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        border-bottom: 2px solid #e6e6e6;
                        padding-bottom: 20px;
                        line-height: 30px;
                      "
                    >
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td
                            width="30%"
                            style="font-size: 14px; padding-left: 10px"
                          >
                            임시 비밀번호
                          </td>
                          <td style="font-size: 14px; font-weight: bold">
                            ${code}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- footer -->
            <tr class="footerWrap">
              <td style="padding: 20px 30px">
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td
                      class="footer-text"
                    >
                      본 메일은 발신전용이므로 회신되지 않습니다.
                    </td>
                  </tr>
                  <tr>
                    <td class="footer-text">
                      국립소방연구원 계정 관련하여 궁금한 점이 있으시면
                      <span>고객센터</span>로 문의해주시기 바랍니다.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
};
