<?php
// api-proxy.php

header('Content-Type: application/json');

// Zugriff nur per POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Only POST allowed"]);
    exit;
}

// Nimm Username/Password aus Request (optional: validieren)
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing credentials"]);
    exit;
}

// API-Request anpassen (hier: Login)
$url = 'https://api.axro.com/api/v1/login/';
$data = http_build_query(['username' => $username, 'password' => $password]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo json_encode(["error" => "Curl error: $error"]);
    exit;
}

// Setze HTTP-Status durch
http_response_code($httpCode);
echo $response;
