<?php

namespace App\Http\Controllers;
use App\Mail\MailAlertRegister;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Mail;
use App\Mail\SetUpMail;

class MailController extends Controller
{
    /**
     * Write code on Method
     *
     * @return Response()
     */
    public function send_mail(Request $request)
    {
        if ($request->to_email) {
            $mailData = [
                'title' => 'Mã Xác Thực OTP',
                'otp' => $request->otp,
                'email' => $request->to_email
            ];
            $mail_dt = Mail::to($request->to_email)->send(new SetUpMail($mailData));
            return response()->json(
                ['kiemtra' => true, 'message' => 'Mã OTP đã được gửi !', "mail_dt" => $mail_dt],
                200
            );

        } else {
            return response()->json(
                ['kiemtra' => false, 'message' => 'Mã OTP chưa được gửi !', "mail_dt" => null],
                200
            );
        }

    }

    /**
     * Write code on Method
     *
     * @return Response()
     */
    public function mail_alert_register(Request $request)
    {
        if ($request->email!=[]) {
            $mailData = [
                'title' => 'Thông Báo Đăng Ký Tài Khoản Thành Công',
                'email' => $request->email,
            ];

            $check_mail_dt = Mail::to($request->email)->send(new MailAlertRegister($mailData));
            return response()->json(
                ['kiemtra' => true, 'message' => 'Đăng ký tài khoản thành công !', "check_mail_dt" => $check_mail_dt],
                200
            );
        } else {
            return response()->json(
                ['kiemtra' => false, 'message' => 'Đăng ký tài không khoản thành công !', "check_mail_dt" => null],
                200
            );
        }

    }
}