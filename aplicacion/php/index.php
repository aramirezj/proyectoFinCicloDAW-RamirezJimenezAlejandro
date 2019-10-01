<?php

$tempTitle = 'https://hasquiz.com/ver/quizz/Cual-seria-tu-X-Men-superpoder-o-mutacion?n=39';
$id = explode("?n=", $tempTitle)[1];

$conexion = new PDO('mysql:host=localhost;dbname=hasquiz;charset=utf8', 'root', '');




$stm = $conexion->prepare('SELECT titulo FROM quizz WHERE id = ?');
$stm->bindValue(1, $id);
$stm->execute();

$row = $stm->fetch(PDO::FETCH_ASSOC);
$tituloQuiz = $row['titulo'];
?>




<!DOCTYPE html>
<html>
<meta name='twitter:card' content='summary_large_image'>
<meta name='twitter:site' content='@hasquiz'>
<meta name='twitter:creator' content='@hasquiz'>
<meta name='twitter:title' content='<?php echo $tituloQuiz;?>'>
<meta name='twitter:description' content='La nueva página web de quizzes, ¡Crea los tuyos propios!.'>
<meta name='twitter:image' content='https://firebasestorage.googleapis.com/v0/b/buzzflix-c94e0.appspot.com/o/HASQUIZ_Mesa%20de%20trabajo%201.png?alt=media&token=9bc9ae58-b709-4f5a-985d-1d0185ee88e2'>

<head>

</head>

<body>
</body>

</html>