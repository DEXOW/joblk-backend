// OTP Email template
exports.emailTemplate = (code) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        </head>
        <body>
        <style>
            .frame {
            background-color: #ffffff;
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            }
            
            .frame .group-wrapper {
                background-color: #ffffff;
                width: 404px;
                height: 526px;
            }
            
            .frame .group {
                position: relative;
                width: 315px;
                height: 407px;
                top: 60px;
                left: 50px;
            }
            
            .frame .img {
                position: absolute;
                width: 124px;
                height: 46px;
                top: 0;
                left: 90px;
            }
            
            .frame .div {
                position: absolute;
                width: 315px;
                height: 56px;
                top: 86px;
                left: 0;
            }
            
            .frame .text-wrapper {
                position: absolute;
                top: 0;
                left: 58px;
                font-family: "Inter-Bold", Helvetica;
                font-weight: 700;
                color: #000000;
                font-size: 24px;
                letter-spacing: 0;
                line-height: normal;
            }
            
            .frame .p {
                position: absolute;
                top: 39px;
                left: 0;
                font-family: "Inter-SemiBold", Helvetica;
                font-weight: 600;
                color: #494949;
                font-size: 14px;
                letter-spacing: 0;
                line-height: normal;
            }
            
            .frame .text-wrapper-2 {
                position: absolute;
                top: 317px;
                left: 62px;
                font-family: "Inter-SemiBold", Helvetica;
                font-weight: 600;
                color: #494949;
                font-size: 14px;
                text-align: center;
                letter-spacing: 0;
                line-height: normal;
            }
            
            .frame .term-conditions {
                position: absolute;
                top: 392px;
                left: 56px;
                font-family: "Inter-Regular", Helvetica;
                font-weight: 400;
                color: #808080;
                font-size: 12px;
                text-align: center;
                letter-spacing: 0;
                line-height: normal;
            }
            
            .frame .div-2 {
                display: inline-flex;
                align-items: flex-start;
                gap: 5px;
                position: absolute;
                top: 197px;
                left: 4px;
            }
            
            .frame .div-wrapper {
                position: relative;
                width: 45px;
                height: 54px;
                background-color: #d9d9d9;
                border-radius: 10px;
            }
            
            .frame .text-wrapper-3 {
                position: absolute;
                top: 11px;
                left: 14px;
                font-family: "Inter-SemiBold", Helvetica;
                font-weight: 600;
                color: #000000;
                font-size: 24px;
                text-align: center;
                letter-spacing: 0;
                line-height: normal;
            }    
        </style>
            <div class="frame">
                <div class="group-wrapper">
                    <div class="group">
                        <img class="img" src="cid:frame.svg" />
                        <div class="div">
                            <div class="text-wrapper">Reset Password</div>
                            <p class="p">To verify your request enter the following OTP</p>
                        </div>
                        <p class="text-wrapper-2">Not you ? Ignore this email</p>
                        <p class="term-conditions">Term &amp; Conditions | ©2023 Job.lk</p>
                        <div class="div-2">
                            <div class="div-wrapper"><div class="text-wrapper-3">${code[0]}</div></div>
                            <div class="div-wrapper"><div class="text-wrapper-3">${code[1]}</div></div>
                            <div class="div-wrapper"><div class="text-wrapper-3">${code[2]}</div></div>
                            <div class="div-wrapper"><div class="text-wrapper-3">${code[3]}</div></div>
                            <div class="div-wrapper"><div class="text-wrapper-3">${code[4]}</div></div>
                            <div class="div-wrapper"><div class="text-wrapper-3">${code[5]}</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `;
}