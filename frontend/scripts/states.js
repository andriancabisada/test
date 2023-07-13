$(document).ready(function () {
  LoadStates();

  $.ajax({
    url: "http://localhost:5275/GetCountries",
    method: "GET",
    success: function (data) {
      populateCountrySelect(data); // Populate select list with country data
    },
    error: function (xhr, status, error) {
      console.error("Error fetching country data:", error);
    },
  });

  function LoadStates() {
    $("#tbl_State").DataTable({
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
        url: "http://localhost:5275/GetStates",
        type: "GET",
        datatype: "JSON",
        dataSrc: "",
      },
      columns: [
        {
          data: "stateId",
          title: "State Id",
          sClass: "dt-body-center",
          orderable: true,
        },
        {
          data: "name",
          title: "State Name",
          sClass: "dt-body-center",
          orderable: true,
        },
        {
          data: "country.name",
          title: "Country Name",
          sClass: "dt-body-center",
          orderable: true,
        },
        {
          data: "stateId",
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

    $("#tbl_State tbody")
      .off()
      .on("click", "tr", function (e) {
        if ($(e.target).is("[id^=btnUpdate],[id^=btnUpdate] i")) {
          var Id = $(this).find("td:eq(0)").text();
          $("#modal_add_state").modal("show");
          UpdateState(Id);
        } else if ($(e.target).is("[id^=btnDelete],[id^=btnDelete] i")) {
          var Id = $(this).find("td:eq(0)").text();
          RemoveState(Id);
        } else if (!$(e.target).is("[id^=btnbars],[id^=btnbars] i")) {
        }
      });
  }

  $("#btn_add_new_state").click(function (e) {
    e.preventDefault();
    NewState();
  });

  function NewState() {
    $("#form_state").trigger("reset");
    $("[name='StateId']").val(0);
    $("#modal_add_state").modal("show");
    
  }

  function populateCountrySelect(countries) {
    var selectList = $("#countrySelect");

    // Loop through the country data and create option elements
    $.each(countries, function (index, country) {
      selectList.append(
        `<option value="` +
          country.countryId +
          `">` +
          country.name +
          "</option>"
      );
    });
  }

  function SaveState() {
    console.log(StateDetails());
    if ($("[name='StateId']").val() == 0) {
      //Add
      $.ajax({
        url: "http://localhost:5275/PostState",
        type: "POST",
        data: JSON.stringify(StateDetails()),
        cache: false,
        contentType: "application/json",
        processData: false,
        success: function (res) {
          alert("Successfully saved.");
          $("#form_state").trigger("reset");
          LoadStates();
          $("[name='StateId']").val(0);
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    } else {
      //Update
      $.ajax({
        url: "http://localhost:5275/PutState",
        type: "PUT",
        data: JSON.stringify(StateDetails()),
        cache: false,
        contentType: "application/json",
        processData: false,
        success: function (res) {
          alert("Successfully updated.");
          $("#form_country").trigger("reset");
          $("[name='CountryId']").val(0);
          $("#modal_add_country").modal("hide");
          LoadStates();
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    }
  }

  $("#btn_save_state").click(function (e) {
    e.preventDefault();
    SaveState();
  });

  function RemoveState(Id) {
    if (window.confirm("Are you sure you want to delete this record?")) {
      $.ajax({
        url: "http://localhost:5275/DeleteStateById/" + Id,
        type: "DELETE",
        success: function (res) {
          alert("Sucessfully deleted.");
          LoadStates();
        },
        error: function (error) {
          alert(error.responseJSON.title);
          console.log(error);
        },
      });
    }
  }
  function UpdateState(Id) {
    $.ajax({
      url: "http://localhost:5275/GetStateById/" + Id,
      type: "GET",
      success: function (res) {
        console.log(res);
        if (res != null) {
          $("[name='StateId']").val(res.stateId);
          $("[name='Name']").val(res.name);
          $("[name='countrySelect']").val(res.countryId);
          // var option = $("<option>").val(res.country.id).text(res.country.name);
          // $("[name='countrySelect']").append(option);
        }
      },
    });
  }

  function StateDetails() {
    var formData = new FormData();
    formData.append(
      "stateId",
      $("[name='StateId']").val() == "" ? 0 : $("[name='StateId']").val()
    );
    formData.append("name", $("[name='Name']").val());
    formData.append("countryId", $("[id='countrySelect']").val());

    var state = {};
    for (var pair of formData.entries()) {
      state[pair[0]] = pair[1];
    }
    return state;
  }
});
