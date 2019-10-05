<?php

$URL = $_GET['url'];
$id = explode("?n=", $URL)[1];

$conexion = new PDO('mysql:host=localhost;dbname=hasquiz;charset=utf8', 'root', '');




$stm = $conexion->prepare('SELECT titulo,banner FROM quizz WHERE id = ?');
$stm->bindValue(1, $id);
$stm->execute();

$row = $stm->fetch(PDO::FETCH_ASSOC);
$tituloQuiz = $row['titulo'];
$banner = $row['banner'];
?>




<!DOCTYPE html>
<html>
<meta name='twitter:card' content='summary_large_image'>
<meta name='twitter:site' content='@hasquiz'>
<meta name='twitter:creator' content='@hasquiz'>
<?php echo "meta name='twitter:title' content='" . $tituloQuiz . "'>"; ?>
<meta name='twitter:description' content='La nueva página web social de quizzes. ¡Crea los tuyos propios!'>
<?php echo '<meta name="twitter:image" content="' . $banner . '">'; ?>

<head>

</head>

<body>
</body>

</html>