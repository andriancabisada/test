$(document).ready(function () {
  $.ajax({
    url: "http://localhost:5275/GetStates",
    method: "GET",
    success: function (data) {
      populateStateSelect(data); // Populate select list with country data
    },
    error: function (xhr, status, error) {
      console.error("Error fetching country data:", error);
    },
  });

  LoadCities();
  function LoadCities() {
    $("#tbl_City").DataTable({
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
        url: "http://localhost:5275/GetCities",
        type: "GET",
        datatype: "JSON",
        dataSrc: "",
      },
      columns: [
        {
          data: "cityId",
          title: "City Id",
          sClass: "dt-body-center",
          orderable: false,
        },
        {
          data: "name",
          title: "City Name",
          sClass: "dt-body-center",
          orderable: false,
        },
        {
          data: "state.name",
          title: "State Name",
          sClass: "dt-body-center",
          orderable: false,
        },
        {
          data: "cityId",
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

    $("#tbl_City tbody")
      .off()
      .on("click", "tr", function (e) {
        if ($(e.target).is("[id^=btnUpdate],[id^=btnUpdate] i")) {
          var Id = $(this).find("td:eq(0)").text();
          $("#modal_add_city").modal("show");
          UpdateCity(Id);
        } else if ($(e.target).is("[id^=btnDelete],[id^=btnDelete] i")) {
          var Id = $(this).find("td:eq(0)").text();
          RemoveCity(Id);
        } else if (!$(e.target).is("[id^=btnbars],[id^=btnbars] i")) {
          // if (!$(this).hasClass("dtactive")) {
          //     $(this).parent().find("tr").removeClass("dtactive");
          //     $(this).addClass("dtactive");
          //     $("[name='FeeDtlsID']").val(SelectedValue("tbl_City", "FeeDtlsID"));
          // } else {
          //     $(this).removeClass("dtactive");
          //     $("[name='FeeDtlsID']").val(0);
          //     $("#form_fees").trigger("reset");
          // }
        }
      });
  }

  $("#btn_add_new_city").click(function (e) {
    e.preventDefault();
    NewCity();
  });
  $("#btn_save_city").click(function (e) {
    e.preventDefault();
    SaveCity();
  });

  function SaveCity() {
    console.log(CityDetails());
    if ($("[name='CityId']").val() == 0) {
      //Add
      $.ajax({
        url: "http://localhost:5275/PostCity",
        type: "POST",
        data: JSON.stringify(CityDetails()),
        cache: false,
        contentType: "application/json",
        processData: false,
        success: function (res) {
          alert("Successfully saved.");
          $("#form_city").trigger("reset");
          LoadCities();
          $("[name='CityId']").val(0);
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    } else {
      //Update
      $.ajax({
        url: "http://localhost:5275/PutCity",
        type: "PUT",
        data: JSON.stringify(CityDetails()),
        cache: false,
        contentType: "application/json",
        processData: false,
        success: function (res) {
          alert("Successfully updated.");
          $("#form_city").trigger("reset");
          $("[name='CityId']").val(0);
          $("#modal_add_city").modal("hide");
          LoadCities();
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    }
  }

  function CityDetails() {
    var formData = new FormData();
    formData.append(
      "cityId",
      $("[name='CityId']").val() == "" ? 0 : $("[name='CityId']").val()
    );
    formData.append("name", $("[name='Name']").val());
    formData.append("stateId", $("[id='stateSelect']").val());

    var city = {};
    for (var pair of formData.entries()) {
      city[pair[0]] = pair[1];
    }
    return city;
  }

  function UpdateCity(Id) {
    $.ajax({
      url: "http://localhost:5275/GetCityById/" + Id,
      type: "GET",
      success: function (res) {
        console.log(res);
        if (res != null) {
          $("[name='CityId']").val(res.cityId);
          $("[name='Name']").val(res.name);
          $("[name='stateSelect']").val(res.stateId);
        }
      },
    });
  }

  function NewCity() {
    $("#form_city").trigger("reset");
    $("[name='CityId']").val(0);
    $("#modal_add_city").modal("show");
  }

  function populateStateSelect(states) {
    var selectList = $("#stateSelect");

    // Loop through the country data and create option elements
    $.each(states, function (index, state) {
      selectList.append(
        `<option value="` + state.stateId + `">` + state.name + "</option>"
      );
    });
  }

  function RemoveCity(Id) {
    if (window.confirm("Are you sure you want to delete this record?")) {
      $.ajax({
        url: "http://localhost:5275/DeleteCityById/" + Id,
        type: "DELETE",
        success: function (res) {
          alert("Sucessfully deleted.");
          LoadCities();
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    }
  }
});
