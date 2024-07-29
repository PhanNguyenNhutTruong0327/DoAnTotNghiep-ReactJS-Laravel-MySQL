<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
    
    'facebook' => [
        'client_id' => '1088708705555830',  //client face của bạn
        'client_secret' => '1ed5bc6ece85b7107c70c7579e319db1',  //client app service face của bạn
        'redirect' => 'http://localhost/apiDoAn/public/api/login-facebook/callback' //callback trả về
    ],

    'google' => [
        'client_id' => '526851168246-nv6emsgo7l6nurvqvdftghh33l8blvor.apps.googleusercontent.com',  //client face của bạn
        'client_secret' => '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',  //client app service face của bạn
        'redirect' => 'http://localhost/apiDoAn/public/api/login-google/callback', //callback trả về
    ],


];
