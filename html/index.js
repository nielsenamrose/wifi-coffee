"use strict";

const img = document.querySelector("#background");
const circle = document.querySelector("#circle");

var doToggle = false;

const updateCircle = function () {
  var ratio = img.naturalWidth / img.naturalHeight;
  var width = img.height * ratio;
  if (width > img.width) {
    width = img.width;
  }
  console.log(`${width}`);
  let r = width / 4.0;
  let b = r / 4.3;
  console.log(r);
  circle.style.width = `${2 * r}px`;
  circle.style.height = `${2 * r}px`;
  circle.style.transform = `translate(${img.width / 2 - r - b - 5}px, ${img.height / 2 - r - b - 20}px)`;
  circle.style["border-width"] = `${b}px`;
};
window.addEventListener("resize", updateCircle);
window.addEventListener("load", updateCircle);

setInterval(() => {
  if (doToggle) circle.classList.toggle("on");
}, 500);

circle.addEventListener("click", () => {
  fetch("http://192.168.1.15:8081/api/push");
  doToggle = true;
  setTimeout(() => {
    doToggle = false;
  }, 10000);
});
