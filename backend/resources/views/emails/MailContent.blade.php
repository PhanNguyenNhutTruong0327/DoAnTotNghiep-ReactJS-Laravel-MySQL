<!DOCTYPE html>
<html>
<head>
    <title>Hello Shop</title>
</head>
<body>
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">{{ $mailData['title'] }}</a>
    </div>
    <p style="font-size:1.1em">Hi, {{ $mailData['email'] }}</p>
    <p>Cảm ơn bạn đã lựa chọn chúng tôi. Sử dụng mã OTP này để hoàn thành đổi mật khẩu. Mã OTP này chỉ có hiệu lực trong 5 phút.</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">{{ $mailData['otp'] }}</h2>
    <p style="font-size:0.9em;">Regards, {{ $mailData['email'] }}<br />Hello Shop</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>Hello Shop</p>
      <p>Việt Nam</p>
    </div>
  </div>
</div>
</body>
</html>