<?php
namespace App\Http\Controllers;
use App\Models\Social; //sử dụng model Social
use Socialite; //sử dụng Socialite
use App\Models\Customers;
use Illuminate\Support\Facades\Redirect;
use Session;
use Illuminate\Http\Response;
use Illuminate\Http\Request;


class LoginController extends Controller
{
    public function login_facebook(){
        try {
            $url = Socialite::driver('facebook')->stateless()
                ->redirect()->getTargetUrl();
            $insecureUrl = str_replace('https://', 'http://', $url);
            return response()->json([
                'url' => $insecureUrl,
            ])->setStatusCode(Response::HTTP_OK);
        } catch (\Exception $exception) {
            return $exception;
        }    
    }

    public function callback_facebook(Request $request){
        try {
            $state = $request->input('state');
            parse_str($state, $result);
            $facebookUser = Socialite::driver('facebook')->stateless()->user();
    
            // Tìm kiếm người dùng dựa trên email từ Facebook
            $user = Customers::where('email', $facebookUser->email)->first();
    
            if ($user) {
                // Người dùng đã tồn tại, sử dụng token hiện có
                $token = $user->createToken('auth_token')->plainTextToken;
                $tokenLifetime = now()->addMinutes(config('sanctum.expiration'));
                return $this->redirectToReact($user->id, $user, $token, $tokenLifetime, $facebookUser->token);
            }
    
            // Người dùng chưa tồn tại, tạo mới
            $newUser = new Customers();
            $newUser->name = mb_convert_encoding($facebookUser->name, 'UTF-8', 'UTF-8') ?? explode('@', $facebookUser->email)[0];
            $newUser->phone_number = '';
            $newUser->email = $facebookUser->email;
            $newUser->password_hash = ''; // Có thể không cần password nếu xác thực bằng token
            $newUser->active = 1;
            $newUser->register_at = now();
            $newUser->created_at = now();
            $newUser->save();
    
            // Lưu thông tin xã hội
            $social = new Social();
            $social->provider_user_id = $facebookUser->id;
            $social->provider = 'facebook';
            $social->customer_id = $newUser->id;
            $social->save();
    
            // Tạo mới token cho người dùng mới
            $token = $newUser->createToken('auth_token')->plainTextToken;
            $tokenLifetime = now()->addMinutes(config('sanctum.expiration'));
            return $this->redirectToReact($newUser->id, $newUser, $token, $tokenLifetime, $facebookUser->token);
    
        } catch (\Exception $exception) {
            return response()->json([
                'status' => __('facebook sign in failed'),
                'error' => $exception,
                'message' => $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    // login google
    public function login_google()
    {
        try {
            $url = Socialite::driver('google')->stateless()
                ->redirect()->getTargetUrl();
            return response()->json([
                'url' => $url,
            ])->setStatusCode(Response::HTTP_OK);
        } catch (\Exception $exception) {
            return $exception;
        }
    }

    public function callback_google(Request $request)
    {
        try {
            $state = $request->input('state');
    
            parse_str($state, $result);
            $googleUser = Socialite::driver('google')->stateless()->user();
    
            // Tìm kiếm người dùng dựa trên email từ Google
            $user = Customers::where('email', $googleUser->email)->first();
    
            if ($user) {
                // Người dùng đã tồn tại, sử dụng token hiện có
                $token = $user->createToken('auth_token')->plainTextToken;
                $tokenLifetime = now()->addMinutes(config('sanctum.expiration'));
                return $this->redirectToReact($user->id, $user, $token, $tokenLifetime, $googleUser->token);
            }
    
            // Người dùng chưa tồn tại, tạo mới
            $newUser = new Customers();
            $newUser->name = mb_convert_encoding($googleUser->name, 'UTF-8', 'UTF-8') ?? explode('@', $googleUser->email)[0];
            $newUser->phone_number = '';
            $newUser->email = $googleUser->email;
            $newUser->password_hash = ''; // Có thể không cần password nếu xác thực bằng token
            $newUser->active = 1;
            $newUser->register_at = now();
            $newUser->created_at = now();
            $newUser->save();
    
            // Lưu thông tin xã hội
            $social = new Social();
            $social->provider_user_id = $googleUser->id;
            $social->provider = 'google';
            $social->customer_id = $newUser->id;
            $social->save();
    
            // Tạo mới token cho người dùng mới
            $token = $newUser->createToken('auth_token')->plainTextToken;
            $tokenLifetime = now()->addMinutes(config('sanctum.expiration'));
            return $this->redirectToReact($newUser->id, $newUser, $token, $tokenLifetime, $googleUser->token);
    
        } catch (\Exception $exception) {
            return response()->json([
                'status' => __('google sign in failed'),
                'error' => $exception,
                'message' => $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
        
    private function redirectToReact($user_id, $user, $token, $tokenLifetime, $gg)
    {
        $time_token= $tokenLifetime->toISOString();
        return redirect('http://localhost:3000/login?token='.$token.'&user_id='.$user_id.'&user_name='.$user->name.'&token_expires_at='.$time_token);
        // return redirect()->to('http://localhost:3000/');
        // return response()->json([
        //     'success' => true,
        //     'message' => 'Đăng nhập thành công!',
        //     'data' => [
        //         'user' => $user,
        //         'token' => $token,
        //         'token_expires_at' => $tokenLifetime->toISOString(),
        //         'gg' => $gg
        //     ]
        // ], 200);
    }



}
