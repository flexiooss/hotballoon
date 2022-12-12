import {ApplicationBuilder} from "../../js/Application/ApplicationBuilder";
import {Dispatcher} from "../../js/Dispatcher/Dispatcher";
import {AsyncDomAccessor} from "../../js/View/DomAccessor";

/**
 * @type {HotBalloonApplication}
 */
const app = new ApplicationBuilder()
  .id('html')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .navigator(navigator)
  .domAccessor(new AsyncDomAccessor(window))
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
