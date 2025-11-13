import {Dispatcher} from "../../js/Dispatcher/Dispatcher.js";
import {BrowserApplicationBuilder} from "../../../BrowserApplicationBuilder.js";

const sizes = [1, 4, 6, 8];
const getSize = () => {
  return sizes[Math.floor(Math.random() * sizes.length)]
}
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
  <li style="padding: 1rem; border: solid 2px #9f9e9e; margin:1rem 0"></li>
</template>`)

let counter = 0;
document.body.insertAdjacentHTML('beforeend', `
<div style="position: absolute; top: 10rem; bottom: 10rem; width: 80%; overflow: auto">
<ul id="test"  style="position: absolute; inset:0"></ul>
</div>
<div id="count" style="padding: 1rem; background: black; color: aliceblue; position: fixed; top: 1rem; left:1rem;">${counter}</div>
`)
const count = document.getElementById("count");
const updatedCount = (visibility=true) => {
  if(visibility){
    counter++;
  }else {
    counter--;
  }
  if(counter < 0 ){
    counter = 0;
  }
  count.textContent = counter;
}

if ("content" in document.createElement("template")) {

  const template = document.querySelector("#template1");

  const list = document.getElementById("test");

  for (let i = 0; i < 1000; i++) {

    let clone = document.importNode(template.content, true);
    let li = clone.querySelectorAll("li");
    li[0].textContent = `item ${i}`;
    li[0].id = `${i}`;
    list.appendChild(clone)
    componentContext.intersectionObserverHandler().observeOnce(document.getElementById(`${i}`),
      (el) => {
        componentContext.scheduler().postTask(()=>{
          console.log(el.id)
          updatedCount()
          el.textContent += ' OK'
          el.style.backgroundColor = '#a0d5f9';
          el.style.height = getSize() + 'rem';
        }).delay(getSize() * 100).background().build().exec()

      })
  }

  // for (let i = 1000; i < 2000; i++) {
  //
  //   let clone = document.importNode(template.content, true);
  //   let li = clone.querySelectorAll("li");
  //   li[0].textContent = `item ${i}`;
  //   li[0].id = `${i}`;
  //   list.appendChild(clone)
  //   componentContext.intersectionObserverHandler().observe(
  //     document.getElementById(`${i}`),
  //     (el, visibility) => {
  //       componentContext.scheduler().postTask(()=>{
  //         console.log(el.id, visibility)
  //         updatedCount(visibility)
  //         el.textContent += (visibility ? ' OK' : ' KO')
  //         el.style.backgroundColor = (visibility ? '#a0d5f9' : '#fff') ;
  //         el.style.height = getSize() + 'rem';
  //       }).delay(getSize() * 100).background().build().exec()
  //
  //
  //     })
  // }

}

// setTimeout(() => {
//   componentContext.intersectionObserverHandler().remove()
// },3000)
