<?php
$deleteFile = "../../" . $_POST["name"] . ".html";

if (file_exists($deleteFile)) {
    unlink($deleteFile);
} else {
    header("HTTP/1/0 404 Not found");
}