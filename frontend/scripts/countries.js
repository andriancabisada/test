$(document).ready(function () {
  LoadCountries();
  function LoadCountries() {
    $("#tbl_Country").DataTable({
      destroy: true,
      responsive: true,
      processing: false,
      search: true,
      stateSave: true,
      info: true,
      searching: true,
      paging: true,
      order: [
        [1, "asc"],
        [2, "asc"],
      ],
      lengthMenu: [
        [5, 10, 20, -1],
        [5, 10, 20, "All"],
      ],
      ajax: {
        url: "http://localhost:5275/GetCountries",
        type: "GET",
        datatype: "JSON",
        dataSrc: "",
      },
      columns: [
        {
          data: "countryId",
          title: "Country Id",
          sClass: "dt-body-center",
          orderable: true,
        },
        {
          data: "name",
          title: "Country Name",
          sClass: "dt-body-center",
          orderable: true,
        },
        {
          data: "countryId",
          title: "Action",
          render: function (data) {
            return (
              "<div class='row justify-content-center'>" +
              "<div class='dropdown dropleft'>" +
              "<button id='btnbars' type='button' class='btn btn-sm btn-success btnbars' data-toggle='dropdown'>" +
              "<i class='fa fa-bars'></i>" +
              "</button> <div class='dropdown-menu'>" +
              "<div class='container fluid'> " +
              "<a id='btnUpdate' class='btn btn-warning btn-sm fa fa-edit col-sm-12' style='margin-bottom: 3px; margin-top: 3px;'>" +
              "&nbspUpdate</a>" +
              "<br />" +
              "<a id='btnDelete' class='btn btn-danger btn-sm fa fa-trash col-sm-12' style='margin-bottom: 3px; margin-top: 3px; color: white;'>" +
              "&nbspDelete</a>" +
              "</div></div></div ></div>"
            );
          },
        },
      ],
    });

    $("#tbl_Country tbody")
      .off()
      .on("click", "tr", function (e) {
        if ($(e.target).is("[id^=btnUpdate],[id^=btnUpdate] i")) {
          var Id = $(this).find("td:eq(0)").text();
          $("#modal_add_country").modal("show");
          UpdateCountry(Id);
        } else if ($(e.target).is("[id^=btnDelete],[id^=btnDelete] i")) {
          var Id = $(this).find("td:eq(0)").text();
          RemoveCountry(Id);
        } else if (!$(e.target).is("[id^=btnbars],[id^=btnbars] i")) {
        }
      });
  }

  $("#btn_add_new_country").click(function (e) {
    e.preventDefault();
    NewCountry();
  });

  function NewCountry() {
    $("#form_country").trigger("reset");
    $("[name='CountryId']").val(0);
    $("#modal_add_country").modal("show");
  }

  function SaveCountry() {
    console.log(CountryDetails());
    if ($("[name='CountryId']").val() == 0) { //Add
      $.ajax({
        url: "http://localhost:5275/PostCountry",
        type: "POST",
        data: JSON.stringify(CountryDetails()),
        cache: false,
        contentType: "application/json",
        processData: false,
        success: function (res) {
          alert("Successfully saved.");
          $("#form_country").trigger("reset");
          LoadCountries();
          $("[name='CountryId']").val(0);
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    } else { //Update
      $.ajax({
        url: "http://localhost:5275/PutCountry",
        type: "POST",
        data: JSON.stringify(CountryDetails()),
        cache: false,
        contentType: "application/json",
        processData: false,
        success: function (res) {
          alert("Successfully updated.");
          $("#form_country").trigger("reset");
          $("[name='CountryId']").val(0);
          $("#modal_add_country").modal("hide");
          LoadCountries();
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    }
  }

  $("#btn_save_country").click(function (e) {
    e.preventDefault();
    SaveCountry();
  });

  function CountryDetails() {
    var formData = new FormData();
    formData.append(
      "countryId",
      $("[name='CountryId']").val() == "" ? 0 : $("[name='CountryId']").val()
    );
    formData.append("name", $("[name='Name']").val());
    var country = {};
    for (var pair of formData.entries()) {
      country[pair[0]] = pair[1];
    }
    return country;
  }

  function RemoveCountry(Id) {
    if (window.confirm("Are you sure you want to delete this record?")) {
      $.ajax({
        url: "http://localhost:5275/DeleteCountryById/" + Id,
        type: "DELETE",
        success: function (res) {
          alert("Sucessfully deleted.");
          LoadCountries();
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    }
  }

  function UpdateCountry(Id) {
    $.ajax({
      url: "http://localhost:5275/GetCountryById/" + Id,
      type: "GET",
      success: function (res) {
        console.log(res);
        if (res != null) {
          $("[name='CountryId']").val(res.countryId);
          $("[name='Name']").val(res.name);
        }
      },
    });
  }
}); //end of document
