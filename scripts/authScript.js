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

                 let success = function (login) {
                     $.cookie('login', login);
                     window.location.href = "notesList";
                }

                let error = function(){
                    $("#authForm :input").prop('disabled', true);
                    let $alertWindow = $('<div class="alertWindow"></div>').appendTo($('body'));
                    $('<div class="alertWindowText">Ошибка входа</div>').appendTo($alertWindow);
                    $('<button class="closeAlertWindowButton">Закрыть</button>').appendTo($alertWindow).on('click', function(){
                        $("#authForm :input").prop('disabled', false);
                        $alertWindow.remove();
                    });
                }

                sendLoginData(login, password, success, error);
             }
          });
}

var options = {
                    method: "GET",
                    url: "http://localhost:62094/api/Login",
                     data: {
                        login: login,
                        password: password
                    },
                    async: false,
                    cache: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        var a = 12;
                    }
}
    
function sendLoginData(login, password, success, error){
    $.ajax(/*{
        method: "GET",
        url: "http://localhost:62094/api/Login",
        async: false,
        data: {
            login: login,
            password: password
        },
        success:(response) => {
            console.log('ajax success');
            success(login);
        },
        error: (err, errText, errThrown) => {
            console.error('ajax error:' + errThrown);
            error();
        }
    }*/
        {  
            type: "GET",  
            url: 'http://localhost:62094/api/Login',  
            data: {
                login: login,
                password: password
            },
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            beforeSend: function(){  
                Show(); // Show loader icon  
            },  
            success: function (response) {  
              
                // Looping over emloyee list and display it  
                $.each(response, function (index, emp) {  
                    $('#output').append('<p>Id: ' + emp.ID + '</p>' +  
                                        '<p>Id: ' + emp.Name + '</p>');  
                });  
            },            
            complete: function(){  
                Hide(); // Hide loader icon  
            },  
            failure: function (jqXHR, textStatus, errorThrown) {                  
                alert("HTTP Status: " + jqXHR.status + "; Error Text: " + jqXHR.responseText); // Display error message  
            }  
        }
    
    );
}
