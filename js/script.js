$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {
  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    return string.replace(new RegExp(propToReplace, "g"), propValue);
  };

  var switchMenuToActive = function () {
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML,
      true
    );
  });

  function buildAndShowHomeHTML(categories) {
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {
        var chosenCategory = chooseRandomCategory(categories);
        var chosenCategoryShortName = chosenCategory.short_name;
        
        var homeHtmlToInsertIntoMainPage = insertProperty(
          homeHtml,
          'randomCategoryShortName',
          "'" + chosenCategoryShortName + "'"
        );
        
        insertHtml('#main-content', homeHtmlToInsertIntoMainPage);
      },
      false
    );
  }

  function chooseRandomCategory(categories) {
    var randomArrayIndex = Math.floor(Math.random() * categories.length);
    return categories[randomArrayIndex];
  }

  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  };

  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML
    );
  };

  // Remaining functions (buildAndShowCategoriesHTML, buildCategoriesViewHtml, 
  // buildAndShowMenuItemsHTML, buildMenuItemsViewHtml, insertItemPrice, 
  // insertItemPortionName) remain unchanged as they were correct

  global.$dc = dc;
})(window);