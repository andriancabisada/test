$(document).ready(function () {
  $("#btn_add_register").click(function (e) {
    e.preventDefault();
    NewRegister();
  });

  $("#btn_save_register").click(function (e) {
    e.preventDefault();
    SaveRegister();
  });

  $("#btn_add_login").click(function (e) {
    e.preventDefault();
    NewLogin();
  });

  //btn_save_login

  $("#btn_save_login").click(function (e) {
    e.preventDefault();
    SaveLogin();
  });

  function SaveRegister() {
    console.log(RegisterDetails());
    if ($("[name='RegisterId']").val() == 0) {
      //Add
      //http://localhost:5275/register?email=andre890%40gmail.com&password=1234
      //JSON.stringify(RegisterDetails()),
      $.ajax({
        url: "http://localhost:5275/register",
        type: "POST",
        data: JSON.stringify(RegisterDetails()),
        cache: false,
        contentType: "application/json",
        processData: false,
        success: function (res) {
          alert("Successfully saved.");
          $("#form_register").trigger("reset");
          $("[name='RegisterId']").val(0);
        },
        error: function (error) {
          console.log(error);
        },
      });
    }
  }
  function SaveLogin() {
    console.log(LoginDetails());

    //Add
    //http://localhost:5275/register?email=andre890%40gmail.com&password=1234
    //JSON.stringify(RegisterDetails()),
    $.ajax({
      url: "http://localhost:5275/login",
      type: "POST",
      data: JSON.stringify(LoginDetails()),
      cache: false,
      contentType: "application/json",
      processData: false,
      success: function (res) {
        alert("Successfully login.");
        $("#username").html(res.username);
        $("#form_login").trigger("reset");

      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  function NewRegister() {
    $("#form_register").trigger("reset");
    $("[name='RegisterId']").val(0);
    $("#modal_add_register").modal("show");
  }
  function NewLogin() {
    $("#form_login").trigger("reset");
    $("[name='LoginId']").val(0);
    $("#modal_add_login").modal("show");
  }

  function RegisterDetails() {
    var formData = new FormData();
    //formData.append("RegisterId", $("[name='RegisterId']").val() == "" ? 0 : $("[name='RegisterId']").val() );
    formData.append("username", $("[name='UserName']").val());
    formData.append("Email", $("[name='Email']").val());
    formData.append("Password", $("[name='Password']").val());
    var city = {};
    for (var pair of formData.entries()) {
      city[pair[0]] = pair[1];
    }
    return city;
  }

  function LoginDetails() {
    var formData = new FormData();
    //formData.append("RegisterId", $("[name='RegisterId']").val() == "" ? 0 : $("[name='RegisterId']").val() );

    formData.append("Email", $("[name='LoginEmail']").val());
    formData.append("Password", $("[name='LoginPassword']").val());
    var city = {};
    for (var pair of formData.entries()) {
      city[pair[0]] = pair[1];
    }
    return city;
  }
  function Login(params) {
   
  }
});
