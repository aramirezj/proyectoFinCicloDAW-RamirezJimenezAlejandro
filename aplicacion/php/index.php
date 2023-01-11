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
<!--Twitter meta tags-->
<meta name='twitter:card' content='summary_large_image'>
<meta name='twitter:site' content='@hasquiz'>
<meta name='twitter:creator' content='@hasquiz'>
<?php echo "<meta name='twitter:title' content='" . $tituloQuiz . "'>"; ?>
<meta name='twitter:description' content='La nueva página web social de quizzes. ¡Crea los tuyos propios!'>
<?php echo '<meta name="twitter:image" content="' . $banner . '">'; ?>
<!--Generícas y pa whatsapp y eso-->
<meta property="og:site_name" content="Hasquiz">
<?php echo "<meta property='og:title' content='" . $tituloQuiz . "'>"; ?>
<meta property="og:description" content="La nueva página web social de quizzes. ¡Crea los tuyos propios!" />
<?php echo '<meta property="og:image:secure_url"  itemprop="image" content="' . $banner . '">'; ?>
<?php echo '<meta property="og:image"  itemprop="image" content="' . $banner . '">'; ?>
<meta property="og:type" content="website" />
<meta property="og:updated_time" content="1440432930" />
<!--<meta property="og:url" content="https://www.hasquiz.com">-->
</head>

<body>
</body>

</html>