// date logic
const weekDay = document.querySelectorAll(".row");
// const pointer = document.getElementById("pointer");
const links = document.querySelectorAll(".link");
const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
// add 2 to weekDay for compensating additional rows
function getCurrentPeriod(hour, minutes) {
  // const lastPeriodStart = new Date().setHours(14, 30, 0);
  // const lastPeriodEnd = new Date().setHours(15, 30, 0);
  // const currenTime = new Date().setHours(hour, minutes, 0);
  if (hour == 9 && minutes <= 50) return 1;
  else if ((hour == 9 && minutes <= 59) || (hour == 10 && minutes <= 40))
    return 2;
  else if ((hour == 10 && minutes <= 59) || (hour == 11 && minutes <= 40))
    return 3;
  else if ((hour == 11 && minutes <= 59) || (hour == 12 && minutes <= 30))
    return 4;
  else if ((hour == 13 && minutes <= 59) || (hour == 14 && minutes <= 10))
    return 5;
  else if (hour == 14 && minutes <= 59) return 6;
  else if (hour == 15) return 7;
}

function setDate() {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDay();
  //   console.log(hour, minutes, day);
  const currentDayElement = weekDay[day + 1];
  const periods = currentDayElement.querySelectorAll(".grid-item");

  const currentPeriod = getCurrentPeriod(hour, minutes);
  // console.log(currentPeriod);
  if (currentPeriod) {
    periods.forEach((el) => el.classList.remove("currentPeriod"));
    periods[currentPeriod].classList.add("currentPeriod");
  }
}

setDate();
setInterval(setDate, 1000 * 60);

window.addEventListener("mousemove", moved);
const coords = {
  x: "",
  y: "",
};

function moved(e) {
  (coords.x = e.clientX), (coords.y = e.clientY);
  // pointer.style.top = coords.y + "px";
  // pointer.style.left = coords.x + "px";
}

function decide() {
  const toRead = confirm("click OK to read the link and cancel to edit");
  if (toRead) {
    displayLink();
    return;
  }
  const toEdit = confirm("do you want to edit the link ?");
  if (!toEdit) return;

  const inputLink = prompt("enter the link?");
  if (!inputLink || !inputLink.trim()) {
    alert("invalid link");
    return;
  }
  displayLink(inputLink);
}

//display link
async function displayLink(link = "") {
  try {
    if (!link) {
      const response = await fetch("/.netlify/functions/link");
      const json = await response.json();
      console.log(json);

      await navigator.clipboard.writeText(json.data);
      alert(`link copied to clipboard\nlink is : \n ${json.data}`);
      return;
    }
    const submissionResponse = await fetch(
      `/.netlify/functions/link?inputLink=${link}`
    );
    const submissionJSON = await submissionResponse.json();
    console.log(submissionJSON);
    alert(`link is : \n ${submissionJSON.message}`);
  } catch (error) {
    console.log(error);
    alert(error.message || "failed to access link");
  }
}

// setting emoji
// function setEmoji(emoji) {
//   if (emoji.match(emojiRegex)) {
//     console.log("its an emoji");
//     document.getElementById("pointer").innerHTML = emoji;
//   } else console.log("not an emoji");
// }

links.forEach((link) => {
  link.addEventListener("click", decide);
});
