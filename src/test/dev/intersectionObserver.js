import {Dispatcher} from "../../js/Dispatcher/Dispatcher";
import {BrowserApplicationBuilder} from "../../../BrowserApplicationBuilder";

/**
 * @type {HotBalloonApplication}
 */
const app = new BrowserApplicationBuilder()
  .id('html')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .build()

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
    app.viewRenderConfig().intersectionObserverHandler().observe(document.getElementById(`${i}`), (el) => {
      console.log(el.id)
      el.textContent += ' OK'
    })
  }

}

setTimeout(() => {
  app.viewRenderConfig().intersectionObserverHandler().clear()
},3000)
