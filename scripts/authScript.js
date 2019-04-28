function sendLogin(){
    $("#authFormWrapper").validate({
             rules:{
                login:{
                  required: true,
                },
                pswd:{
                  required: true,
                },
             },
             messages:{
               login:{
                 required: "Это поле обязательно для заполнения",
             },
               pswd:{
               required: "Это поле обязательно для заполнения",
               },
             },
             submitHandler: () => {
                let login = $('#login').val();

                console.log('send login: ' + login);

                let password = $('#password').val();

                 let success = function (login, response) {
                     window.location.href = "/NoteList";
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
        success:(response) => {
            console.log('ajax success');
            success(login, response);
        },
        error: (err, errText, errThrown) => {
            console.error('ajax error:' + errThrown);
            error();
        }
    });
}