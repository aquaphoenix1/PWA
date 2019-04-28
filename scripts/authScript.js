function sendLogin(){
    $("#authFormWrapper").validate({
             rules:{
                login:{
                  required: true,
                  minlength: 4,
                  maxlength: 16,
                },
                pswd:{
                  required: true,
                  minlength: 6,
                  maxlength: 16,
                },
             },
             messages:{
               login:{
                 required: "Это поле обязательно для заполнения",
                 minlength: "Логин должен быть минимум 4 символа",
                 maxlength: "Максимальное число символов - 16",
             },
               pswd:{
               required: "Это поле обязательно для заполнения",
               minlength: "Пароль должен быть минимум 6 символа",
               maxlength: "Пароль должен быть максимум 16 символов",
               },
             },
             submitHandler: () => {
                let login = $('#login').val();

                console.log('send login: ' + login);

                let password = $('#password').val();

                let success = function(){

                }

                let error = function(){
                    alert("Ошипка");
                }

                sendLoginData(login, password, success, error);
             }
          });
}


function sendLoginData(login, password, success, error){
    $.ajax({
        method: "GET",
        url: "/login",
        async: false,
        data: {
            login: login,
            password: password
        },
        success:() => {
            console.log('ajax success');
            success();
        },
        error: (err, errText, errThrown) => {
            console.error('ajax error:' + errThrown);
            error();
        }
    });
}