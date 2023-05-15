import {Dispatcher} from "../../js/Dispatcher/Dispatcher.js";
import {BrowserApplicationBuilder} from "../../../BrowserApplicationBuilder.js";

/**
 * @type {HotBalloonApplication}
 */
const app = new BrowserApplicationBuilder()
  .id('html')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .build()
const componentContext = app.addComponentContext('test')

document.body.insertAdjacentHTML('beforeend', `<template id="template1">
  <li></li>
</template>`)

document.body.insertAdjacentHTML('beforeend', `<ul id="test"></ul>`)


if ("content" in document.createElement("template")) {

  const template = document.querySelector("#template1");

  const list = document.getElementById("test");

  for (let i = 0; i < 1000; i++) {

    let clone = document.importNode(template.content, true);
    let li = clone.querySelectorAll("li");
    li[0].textContent = `item ${i}`;
    li[0].id = `${i}`;
    list.appendChild(clone)
    componentContext.intersectionObserverHandler().observeOnce(document.getElementById(`${i}`), (el) => {
      console.log(el.id)
      el.textContent += ' OK'
    })
  }

  for (let i = 1000; i < 2000; i++) {

    let clone = document.importNode(template.content, true);
    let li = clone.querySelectorAll("li");
    li[0].textContent = `item ${i}`;
    li[0].id = `${i}`;
    list.appendChild(clone)
    componentContext.intersectionObserverHandler().observe(document.getElementById(`${i}`), (el, visibility) => {
      console.log(el.id, visibility)
      el.textContent += (visibility ? ' OK' : ' KO')
    })
  }

}

// setTimeout(() => {
//   componentContext.intersectionObserverHandler().remove()
// },3000)
