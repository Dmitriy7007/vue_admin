const $ = require("jquery");

function getPagesList() {
  $("h1").remove();
  $.get(
    "./api/api.php",
    (data) => {
      data.forEach((file) => {
        $("body").append("<h1>" + file + "</h1>");
      });
    },
    "JSON"
  );
}

getPagesList();

$(".button_create-page").on("click", () => {
  $.post(
    "./api/createNewHtmlPage.php",
    {
      name: $("input").val(),
    },
    (data) => {
      getPagesList();
    }
  ).fail(() => {
    alert("Такая страница уже существует");
  });
});

$(".button_delete-page").on("click", () => {
  $.post(
    "./api/deletePage.php",
    {
      name: $("input").val(),
    },
    (data) => {
      getPagesList();
    }
  ).fail(() => {
    alert("Страница не найдена");
  });
});
