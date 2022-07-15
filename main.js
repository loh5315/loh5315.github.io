"use-strict";

let todoArray = [];
let dark = false;

//로컬스토리지에서 가져오기
$(document).ready(() => {
  let stored = localStorage.getItem("list");
  let stored2 = localStorage.getItem("doneList");
  let changedStored = JSON.parse(stored);
  let changedStored2 = JSON.parse(stored2);
  changedStored.map((item, index) => {
    todoArray.push({ id: index, name: item, done: changedStored2[index] });
  });
  let darkBtn = JSON.parse(localStorage.getItem("dark"));
  if (darkBtn == true) {
    $("body").addClass("dark");
    dark = true;
  }
  makeList();
});

$(window).on("beforeunload", () => {
  let list = [];
  let doneList = [];
  todoArray.map((item) => {
    list.push(item.name);
    doneList.push(item.done);
  });
  localStorage.setItem("list", JSON.stringify(list));
  localStorage.setItem("doneList", JSON.stringify(doneList));
});

//listMaking function
function makeList() {
  todoList.html("");
  todoArray.forEach((item, index) => {
    $(".todo-list").append(`
          <li id="${index}" class="todo ${item.done ? `crossed` : null} delete">
              <input type="checkbox" id="input${item.id}" class="check-btn" ${
      item.done ? `checked` : ``
    } ></input>
              <label for="input${item.id}">${item.name}</label>
              <button class="close-button"><i class="fa-solid fa-x"></i></button>
          </li>
      `);

    $(".check-btn")
      .eq(index)
      .on("click", function (e) {
        let btn = $(e.target).parent().attr("id");
        if (todoArray[btn].done == false) {
          todoArray[btn].done = true;
        } else {
          todoArray[btn].done = false;
        }
        console.log(todoArray);
        $(`#${btn}`).toggleClass("crossed");
        active == 1 ? $(`#${btn}`).addClass("hide") : null;
      });

    $(".close-button")
      .eq(index)
      .click(function (e) {
        let btn = $(e.target).parents(".todo").attr("id");
        console.log(btn);
        let delNum = todoArray.findIndex((item) => item.id === Number(btn));
        console.log(delNum);
        todoArray.splice(delNum, 1);
        // doneList.splice(btn, 1);
        $(`#${btn}`).addClass("hide");
        setTimeout(() => {
          $(`#${btn}`).remove();
          console.log(todoArray);
        }, 1000);
      });
    setTimeout(() => {
      $(".todo").removeClass("delete");
    }, 20);
  });
}

let todoInput = $(".todo-input");
let todoList = $(".todo-list");
let doneBtn = $(".done-btn");
let todoBtn = $(".todo-btn");
let allBtn = $(".all-btn");
let resetBtn = $(".reset");

//입력시 리스트에 추가
todoInput.on("keyup", function (e) {
  let input = e.currentTarget.value;
  if (e.keyCode == 13) {
    if (input != "") {
      let length = todoArray.length;
      todoArray.push({ id: length, name: input, done: false });
      // doneList.push(false);
      let num = todoArray.length;
      if (active !== 0) {
        all();
      }
      $(".todo-list").append(`
          <li id="${num - 1}" class="todo ${
        todoArray.done ? `crossed` : null
      } delete ">
              <input type="checkbox" id="input${num}" class="check-btn" ${
        todoArray.done ? `checked` : ``
      }></input>
              <label for="input${num}">${todoArray[num - 1].name}</label>
              <button class="close-button"><i class="fa-solid fa-x"></i></button>
          </li>
      `);
      console.log(todoArray);
      $(".check-btn")
        .eq(num - 1)
        .on("click", function (e) {
          let btn = $(e.target).parent().attr("id");
          let done = todoArray.find((item) => item.id == btn);
          console.log(done);
          if (done.done == false) {
            todoArray.find((item) => item.id == done.id).done = true;
            console.log(todoArray);
          } else {
            todoArray.find((item) => item.id == done.id).done = false;
            console.log(todoArray);
          }
          $(`#${btn}`).toggleClass("crossed");
          active == 1 ? $(`#${btn}`).addClass("hide") : null;
        });

      $(".close-button")
        .eq(num - 1)
        .click(function (e) {
          let btn = $(e.target).parents(".todo").attr("id");
          console.log(btn);
          let delNum = todoArray.findIndex((item) => item.id === Number(btn));
          console.log(delNum);
          todoArray.splice(delNum, 1);
          // doneList.splice(btn, 1);
          $(`#${btn}`).addClass("hide");
          setTimeout(() => {
            $(`#${btn}`).remove();
            console.log(todoArray);
          }, 1000);
        });

      setTimeout(() => {
        $(".todo").removeClass("delete");
      }, 20);
    }
    $(".todo-input").val("");
  }
});

//완료한 일만 보이기
let active = 0;
let clicked = false;

function all() {
  $(".todo").removeClass("hide");
  active = 0;
  doneBtn.removeClass("active");
  todoBtn.removeClass("active");
  allBtn.addClass("active");
}

function done() {
  if ((clicked = false)) {
    $(".todo").not(".crossed").addClass("hide");
  } else {
    $(".crossed").removeClass("hide");
    $(".todo").not(".crossed").addClass("hide");
    clicked = true;
  }
  active = 1;
  todoBtn.removeClass("active");
  allBtn.removeClass("active");
  doneBtn.addClass("active");
}

function todo() {
  if ((clicked = false)) {
    $(".crossed").addClass("hide");
  } else {
    $(".todo").not(".crossed").removeClass("hide");
    $(".crossed").addClass("hide");
  }
  active = 2;
  doneBtn.removeClass("active");
  allBtn.removeClass("active");
  todoBtn.addClass("active");
}

allBtn.on("click", () => {
  all();
});

doneBtn.on("click", () => {
  done();
});

todoBtn.on("click", () => {
  todo();
});

resetBtn.click(() => {
  todoArray = [];
  doneList = [];
  localStorage.setItem("list", JSON.stringify(todoArray));
  localStorage.setItem("doneList", JSON.stringify(doneList));
  makeList();
  clicked = false;
});

//다크모드

function darkModeBtn() {
  $("body").toggleClass("dark");
}

$(".darkmode").click(() => {
  darkModeBtn();
  dark == true ? (dark = false) : (dark = true);
  console.log(dark);
  localStorage.setItem("dark", dark);
});

//명언 가져오기

$.get("https://quotes.rest/qod?language=en") //
  .done((data) => {
    let result = data.contents.quotes[0];
    $(".quote").append(`<span>${result.quote}</span>`);
    $(".quote").append(`<h4> -${result.author}-</h4>`);
  });
