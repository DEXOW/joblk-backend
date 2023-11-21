// OTP Email template
exports.emailTemplate = (code, heading) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
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
                    background-color: #eae8e8;
                    max-width: 404px;
                    max-height: 526px;
                    border-radius: 10px;
                }

                .frame .group {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    margin-top: 60px;
                    margin-left: 40px;
                    margin-right: 40px;
                    margin-bottom: 40px;
                }

                .frame .img {
                    width: 124px;
                    height: 46px;
                }

                .frame .div {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 40px;
                    gap: 10px;
                }

                .frame .text-wrapper {
                    font-family: "Inter-Bold", Helvetica;
                    font-weight: 700;
                    color: #000000;
                    font-size: 24px;
                    letter-spacing: 0;
                    line-height: normal;
                }

                .frame .p {
                    margin: 0;
                    font-family: "Inter-SemiBold", Helvetica;
                    font-weight: 600;
                    color: #494949;
                    font-size: 14px;
                    letter-spacing: 0;
                    line-height: normal;
                }

                .frame .div-2 {
                    display: inline-flex;
                    align-items: flex-start;
                    gap: 5px;
                    margin-top: 55px;
                    margin-bottom: 66px;
                }

                .frame .div-wrapper {
                    position: relative;
                    width: 45px;
                    height: 54px;
                    background-color: #d9d9d9;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .frame .text-wrapper-3 {
                    font-family: "Inter-SemiBold", Helvetica;
                    font-weight: 600;
                    color: #000000;
                    font-size: 24px;
                    text-align: center;
                    letter-spacing: 0;
                    line-height: normal;
                }

                .frame .div-3 {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .frame .text-wrapper-2 {
                    font-family: "Inter-SemiBold", Helvetica;
                    font-weight: 600;
                    color: #494949;
                    font-size: 14px;
                    text-align: center;
                    letter-spacing: 0;
                    line-height: normal;
                }

                .frame .term-conditions {
                    font-family: "Inter-Regular", Helvetica;
                    font-weight: 400;
                    color: #808080;
                    font-size: 12px;
                    text-align: center;
                    letter-spacing: 0;
                    line-height: normal;
                }
            </style>
            <div class="frame">
                <div class="group-wrapper">
                    <div class="group">
                        <div class="img">
                            <svg
                                width="124"
                                height="46"
                                viewBox="0 0 124 46"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g id="Frame" clip-path="url(#clip0_425_5)">
                                    <path
                                        id="Vector"
                                        d="M30.2643 7.5323C30.2643 8.40309 30.0844 9.05618 29.7245 9.49157C29.3587 9.92697 28.7695 10.1447 27.9568 10.1447C27.8987 10.7542 27.7681 11.8137 27.5649 13.323C27.2746 15.3549 27.115 16.4869 27.086 16.7191C24.5026 35.9635 19.1183 45.5857 10.9329 45.5857C8.52371 45.5857 6.64572 44.9036 5.2989 43.5393C3.94628 42.1751 3.26997 40.4625 3.26997 38.4017C3.26997 34.7154 4.83738 31.4557 7.97221 28.6228C11.107 25.7956 15.2288 23.4532 20.3374 21.5955C20.6567 19.5346 20.9034 17.6915 21.0776 16.066L21.8613 9.49157C20.1197 9.31742 18.4942 9.23034 16.9849 9.23034C12.9502 9.23034 9.97502 9.62219 8.05929 10.4059C6.14356 11.1896 5.1857 12.4668 5.1857 14.2374C5.1857 15.1081 5.47596 16.0515 6.05648 17.0674C6.23064 17.3577 6.31772 17.6625 6.31772 17.9817C6.31772 18.5913 6.00714 19.1341 5.38598 19.6101C4.75901 20.0919 4.0827 20.3329 3.35704 20.3329C2.42821 20.3329 1.71706 19.941 1.22362 19.1573C0.410884 17.8221 0.0045166 16.2692 0.0045166 14.4986C0.0045166 7.5323 6.10002 4.04916 18.291 4.04916C21.8322 4.04916 24.9961 4.39747 27.7826 5.0941C29.4371 5.50047 30.2643 6.3132 30.2643 7.5323ZM11.4989 40.927C12.9212 40.927 14.3435 39.853 15.7658 37.7051C17.188 35.5571 18.4362 31.7982 19.5101 26.4284C12.4277 29.5342 8.88654 33.3366 8.88654 37.8357C8.88654 38.8226 9.11875 39.5831 9.58317 40.1171C10.0476 40.657 10.6862 40.927 11.4989 40.927ZM51.5986 27.5604C51.976 27.5604 52.2662 27.7491 52.4694 28.1264C52.6726 28.5037 52.7742 28.9827 52.7742 29.5632C52.7742 30.9565 52.3533 31.7837 51.5115 32.0449C49.77 32.6545 47.8542 33.0028 45.7643 33.0899C45.2129 35.5281 44.1244 37.4816 42.4989 38.9503C40.8734 40.4132 39.0303 41.1447 36.9694 41.1447C35.2278 41.1447 33.7388 40.7238 32.5023 39.882C31.2716 39.0403 30.3369 37.9228 29.6983 36.5295C29.0598 35.1362 28.7405 33.6269 28.7405 32.0014C28.7405 29.7954 29.1614 27.8274 30.0031 26.0975C30.8449 24.3733 32.0059 23.0236 33.4863 22.0483C34.9666 21.0788 36.6066 20.5941 38.4062 20.5941C40.6122 20.5941 42.3886 21.3546 43.7354 22.8756C45.088 24.4023 45.8805 26.2832 46.1127 28.5183C47.4769 28.4312 49.1024 28.1409 50.9891 27.6475C51.2213 27.5894 51.4245 27.5604 51.5986 27.5604ZM37.3177 36.5295C38.2466 36.5295 39.0506 36.1522 39.7298 35.3975C40.4148 34.6428 40.8734 33.5543 41.1056 32.132C40.2058 31.5225 39.515 30.7243 39.0332 29.7374C38.5571 28.7505 38.3191 27.7055 38.3191 26.6025C38.3191 26.1381 38.3627 25.6737 38.4497 25.2093H38.232C37.071 25.2093 36.1044 25.7666 35.3323 26.8812C34.566 28.0016 34.1829 29.5777 34.1829 31.6096C34.1829 33.206 34.4935 34.4251 35.1146 35.2669C35.7416 36.1086 36.476 36.5295 37.3177 36.5295ZM72.1927 27.5604C72.5701 27.5604 72.8603 27.7491 73.0635 28.1264C73.2667 28.5037 73.3683 28.9827 73.3683 29.5632C73.3683 30.2889 73.2667 30.8462 73.0635 31.2351C72.8603 31.6299 72.541 31.8998 72.1056 32.0449C70.3641 32.6545 68.4483 33.0028 66.3584 33.0899C65.7779 35.4991 64.6807 37.4438 63.0669 38.9242C61.4588 40.4045 59.6824 41.1447 57.7377 41.1447C54.806 41.1447 52.6726 40.0272 51.3374 37.7921C50.0022 35.5571 49.3346 32.3207 49.3346 28.0829C49.3346 24.3385 49.799 20.2661 50.7278 15.8657C51.6567 11.4712 53.0122 7.72678 54.7944 4.63258C56.5824 1.54419 58.71 0 61.1773 0C62.5125 0 63.5864 0.571818 64.3992 1.71545C65.2119 2.86489 65.6183 4.35393 65.6183 6.18258C65.6183 8.56273 65.1684 10.9284 64.2686 13.2795C63.3687 15.6306 61.8739 18.0978 59.784 20.6812C61.7288 20.8263 63.3107 21.6303 64.5298 23.0933C65.7489 24.562 66.4746 26.3703 66.7068 28.5183C68.071 28.4312 69.6965 28.1409 71.5832 27.6475C71.7573 27.5894 71.9605 27.5604 72.1927 27.5604ZM60.1759 4.31039C59.5953 4.31039 58.9626 5.17247 58.2776 6.89663C57.5983 8.62659 56.9685 10.9719 56.3879 13.9326C55.8074 16.8933 55.372 20.1297 55.0818 23.6419C56.9975 20.1297 58.5272 17.0297 59.6708 14.3419C60.8202 11.6598 61.395 9.27388 61.395 7.18399C61.395 6.25515 61.2847 5.54401 61.0641 5.05056C60.8493 4.55712 60.5532 4.31039 60.1759 4.31039ZM57.9118 36.5295C58.8116 36.5295 59.6099 36.1522 60.3065 35.3975C61.0031 34.6428 61.4675 33.5543 61.6997 32.132C60.7999 31.5225 60.1091 30.7243 59.6273 29.7374C59.1512 28.7505 58.9132 27.7055 58.9132 26.6025C58.9132 26.1962 58.9713 25.6447 59.0874 24.948H58.9568C57.7667 24.948 56.7711 25.5373 55.97 26.7157C55.1746 27.8884 54.777 29.4616 54.777 31.4354C54.777 33.0899 55.0876 34.3525 55.7087 35.2233C56.3357 36.0941 57.0701 36.5295 57.9118 36.5295ZM75.2318 41.1447C73.9546 41.1447 72.9909 40.7963 72.3408 40.0997C71.6848 39.4031 71.3568 38.4888 71.3568 37.3567C71.3568 36.0506 71.7283 35.0056 72.4714 34.2219C73.2086 33.4382 74.2449 33.0464 75.5801 33.0464C76.8572 33.0464 77.8238 33.3569 78.4798 33.9781C79.13 34.6051 79.4551 35.5281 79.4551 36.7472C79.4551 38.0824 79.0777 39.1477 78.3231 39.943C77.5684 40.7441 76.5379 41.1447 75.2318 41.1447ZM99.9186 31.2177C100.296 31.2177 100.595 31.3919 100.815 31.7402C101.03 32.0885 101.138 32.5674 101.138 33.177C101.138 34.338 100.862 35.2378 100.31 35.8764C99.0623 37.4148 97.7068 38.6774 96.2438 39.6643C94.7751 40.6512 93.1119 41.1447 91.2542 41.1447C88.6999 41.1447 86.8074 39.9836 85.5767 37.6615C84.3402 35.3394 83.7219 32.3352 83.7219 28.6489C83.7219 25.1077 84.1805 21.073 85.0978 16.5449C86.0092 12.0169 87.3589 8.12734 89.1469 4.8764C90.9291 1.62547 93.0539 0 95.5211 0C96.9143 0 98.0115 0.644383 98.8127 1.93315C99.608 3.22772 100.006 5.07959 100.006 7.48876C100.006 10.9429 99.0478 14.9485 97.132 19.5056C95.2163 24.0627 92.6185 28.5763 89.3385 33.0464C89.5417 34.2364 89.8755 35.084 90.3399 35.589C90.8043 36.0999 91.4139 36.3553 92.1686 36.3553C93.3586 36.3553 94.4036 36.0128 95.3034 35.3278C96.2032 34.6486 97.3497 33.4817 98.743 31.8272C99.0913 31.4209 99.4832 31.2177 99.9186 31.2177ZM94.5632 4.31039C93.8956 4.31039 93.1409 5.51498 92.2992 7.92416C91.4574 10.3333 90.7172 13.323 90.0787 16.8933C89.4401 20.4635 89.0918 23.8886 89.0337 27.1685C91.0946 23.7725 92.7346 20.3677 93.9537 16.9542C95.1728 13.5465 95.7823 10.4349 95.7823 7.61938C95.7823 5.41339 95.376 4.31039 94.5632 4.31039ZM122.777 31.2177C123.154 31.2177 123.45 31.3919 123.665 31.7402C123.886 32.0885 123.996 32.5674 123.996 33.177C123.996 34.338 123.72 35.2378 123.169 35.8764C121.862 37.4728 120.542 38.75 119.206 39.7079C117.871 40.6657 116.289 41.1447 114.461 41.1447C112.226 41.1447 110.426 40.5061 109.062 39.2289C107.698 37.9518 107.015 36.2537 107.015 34.1348C107.015 33.0028 107.596 32.1901 108.757 31.6966C110.034 31.1451 110.949 30.5559 111.5 29.9289C112.052 29.3078 112.327 28.5473 112.327 27.6475C112.327 27.125 112.217 26.7331 111.996 26.4719C111.782 26.2107 111.515 26.0801 111.195 26.0801C110.412 26.0801 109.547 26.6461 108.6 27.7781C107.66 28.9101 106.783 30.3672 105.971 32.1494C105.158 33.9375 104.519 35.7748 104.055 37.6615C103.736 39.0258 103.364 39.9459 102.94 40.4219C102.522 40.9037 101.863 41.1447 100.964 41.1447C100.064 41.1447 99.4019 40.8167 98.9781 40.1607C98.5601 39.5105 98.2786 38.5033 98.1334 37.139C97.9883 35.7748 97.9158 33.772 97.9158 31.1306C97.9158 26.6606 98.3715 22.0019 99.2829 17.1545C100.2 12.3071 101.55 8.23474 103.332 4.93736C105.12 1.64579 107.262 0 109.758 0C111.094 0 112.173 0.571818 112.998 1.71545C113.828 2.86489 114.243 4.35393 114.243 6.18258C114.243 9.11423 113.387 12.1533 111.674 15.2997C109.962 18.452 107.175 22.1325 103.315 26.3413C103.228 27.8507 103.184 29.4036 103.184 31C104.577 27.3717 106.174 24.7361 107.973 23.0933C109.773 21.4562 111.456 20.6376 113.024 20.6376C114.475 20.6376 115.642 21.1311 116.524 22.118C117.413 23.1049 117.857 24.324 117.857 25.7753C117.857 27.3717 117.45 28.8375 116.638 30.1728C115.825 31.508 114.432 32.698 112.458 33.743C112.574 34.5267 112.928 35.1566 113.52 35.6326C114.118 36.1144 114.838 36.3553 115.68 36.3553C116.58 36.3553 117.45 36.007 118.292 35.3104C119.134 34.6138 120.237 33.4527 121.601 31.8272C121.949 31.4209 122.341 31.2177 122.777 31.2177ZM108.844 4.31039C108.322 4.31039 107.741 5.05637 107.103 6.54832C106.464 8.04607 105.846 10.0663 105.248 12.609C104.656 15.1459 104.171 17.9092 103.794 20.8989C105.593 18.78 107.079 16.4724 108.252 13.9761C109.43 11.4799 110.02 9.21582 110.02 7.18399C110.02 6.25515 109.918 5.54401 109.715 5.05056C109.512 4.55712 109.221 4.31039 108.844 4.31039Z"
                                        fill="#1DBF73"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_425_5">
                                        <rect
                                            width="124"
                                            height="45.5857"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div class="div">
                            <div class="text-wrapper">${heading}</div>
                            <p class="p">
                                To verify your request enter the following OTP
                            </p>
                        </div>
                        <div class="div-2">
                            <div class="div-wrapper">
                                <div class="text-wrapper-3">${code[0]}</div>
                            </div>
                            <div class="div-wrapper">
                                <div class="text-wrapper-3">${code[1]}</div>
                            </div>
                            <div class="div-wrapper">
                                <div class="text-wrapper-3">${code[2]}</div>
                            </div>
                            <div class="div-wrapper">
                                <div class="text-wrapper-3">${code[3]}</div>
                            </div>
                            <div class="div-wrapper">
                                <div class="text-wrapper-3">${code[4]}</div>
                            </div>
                            <div class="div-wrapper">
                                <div class="text-wrapper-3">${code[5]}</div>
                            </div>
                        </div>
                        <div class="div-3">
                            <p class="text-wrapper-2">Not you ? Ignore this email</p>
                            <p class="term-conditions">
                                Term &amp; Conditions | ©2023 Job.lk
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `;
}