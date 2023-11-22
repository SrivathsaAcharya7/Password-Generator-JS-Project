const inputslider = document.querySelector("[slidercondata]");
const lengthdisplay = document.querySelector("[passlendata]");
const passworddisplay = document.querySelector("[data-passworddisplay]");
const copybtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberscheck = document.querySelector("#Numbers");
const symbolscheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generateButton");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+=-{[}]|:;"<,>.?/';

let password = "";
let passwordlength = 10;
let checkboxcount = 0;

handleSlider();
handleIndicator("#ccc");

function handleSlider() {
  inputslider.value = passwordlength;
  lengthdisplay.innerText = passwordlength;
  const min = inputslider.min;
  const max = inputslider.max;
  inputslider.style.backgroundSize =
    ((passwordlength - min) * 100) / (max - min) + "% 100%";
}

function handleIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getrndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getrndNumber() {
  return getrndInteger(0, 9);
}
function getUpperCase() {
  return String.fromCharCode(getrndInteger(65, 91));
}
function getLowerCase() {
  return String.fromCharCode(getrndInteger(97, 123));
}

function getSymbols() {
  const randomnum = getrndInteger(0, symbols.length);
  return symbols.charAt(randomnum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercasecheck.checked) hasUpper = true;
  if (lowercasecheck.checked) hasLower = true;
  if (numberscheck.checked) hasNum = true;
  if (symbolscheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
    handleIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordlength >= 6
  ) {
    handleIndicator("#ff0");
  } else {
    handleIndicator("#f00");
  }
}

function handleCheckboxChange() {
  checkboxcount = 0;
  allcheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxcount++;
    }
  });
  if (passwordlength < checkboxcount) {
    passwordlength = checkboxcount;
    handleSlider();
  }
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

allcheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passworddisplay.value);
    copymsg.innerText = "Copied";
  } catch (e) {
    copymsg.innerText = "Failed";
  }
  copymsg.classList.add("active");
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

inputslider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handleSlider();
});

copybtn.addEventListener("click", () => {
  if (passworddisplay.value) {
    copyContent();
  }
});

generatebtn.addEventListener("click", () => {
  if (checkboxcount == 0) {
    return;
  }
  if (passwordlength < checkboxcount) {
    passwordlength = checkboxcount;
    handleSlider();
  }

  let funcArr = [];

  if (uppercasecheck.checked) {
    funcArr.push(getUpperCase);
  }
  if (lowercasecheck.checked) {
    funcArr.push(getLowerCase);
  }
  if (numberscheck.checked) {
    funcArr.push(getrndNumber);
  }
  if (symbolscheck.checked) {
    funcArr.push(getSymbols);
  }

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("compulsory addition done");
  for (let i = 0; i < passwordlength - funcArr.length; i++) {
    let ranIndex = getrndInteger(0, funcArr.length);
    console.log("randindex" + ranIndex);
    password += funcArr[ranIndex]();
  }
  console.log("Remaining addition done");
  password = shufflePassword(Array.from(password));
  passworddisplay.value = password;

  calcStrength();
});
