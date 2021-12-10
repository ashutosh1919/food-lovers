<?php 

    if(isset($_POST['btn-send']))
    {
       $UserName = $_POST['name'];
       $Email = $_POST['email'];
       $Msg = 'Name: ' . $UserName . '   Email: ' . $Email . '  Message: ' . $_POST['Note'];
       $subject = 'Message from Customer';
       $header = array(
        'From' => 'foodloverz2021@gmail.com',
        'Reply-To' => 'foodloverz2021@gmail.com',
        'X-Mailer' => 'PHP/' . phpversion()
        );

       if(empty($UserName) || empty($Email) || empty($Msg))
       {
           header('location:contact.html?error');
       }
       else
       {
           $to = "ashutoshhathidara98@gmail.com";

           if(mail($to,$subject,$Msg,$header))
           {
               header("location:contact.html?success");
           }
       }
    }
    else
    {
        header("location:contact.html");
    }
?>