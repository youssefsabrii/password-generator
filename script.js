// DOM Elements
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthLabel = document.getElementById("strength-label");
const warningCard = document.getElementById("warning-card");
const themeToggle = document.getElementById("theme-toggle");

// Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// Event listeners
lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});
generateButton.addEventListener("click", makePassword);
copyButton.addEventListener("click", copyPassword);
themeToggle.addEventListener("click", toggleTheme);
window.addEventListener("DOMContentLoaded", makePassword);

// Generate password
function makePassword() {
  const length = Number(lengthSlider.value);
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;

  if (
    !includeUppercase &&
    !includeLowercase &&
    !includeNumbers &&
    !includeSymbols
  ) {
    showWarning("Please select at least one character type.");
    return;
  }

  const password = createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  );
  passwordInput.value = password;
  updateStrengthMeter(password);
}

function createRandomPassword(
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) {
  let allChars = "";
  let guaranteedChars = [];

  if (includeUppercase) {
    allChars += uppercaseLetters;
    guaranteedChars.push(randomChar(uppercaseLetters));
  }
  if (includeLowercase) {
    allChars += lowercaseLetters;
    guaranteedChars.push(randomChar(lowercaseLetters));
  }
  if (includeNumbers) {
    allChars += numberCharacters;
    guaranteedChars.push(randomChar(numberCharacters));
  }
  if (includeSymbols) {
    allChars += symbolCharacters;
    guaranteedChars.push(randomChar(symbolCharacters));
  }

  let passwordChars = [...guaranteedChars];

  for (let i = guaranteedChars.length; i < length; i++) {
    passwordChars.push(randomChar(allChars));
  }

  return shuffleArray(passwordChars).join("");
}

function randomChar(str) {
  return str[Math.floor(Math.random() * str.length)];
}
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateStrengthMeter(password) {
  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()-_=+\[\]{}|;:,.<>?/]/.test(password);

  let score = Math.min(length * 2, 40);
  if (hasUpper) score += 15;
  if (hasLower) score += 15;
  if (hasNumber) score += 15;
  if (hasSymbol) score += 15;
  if (length < 8) score = Math.min(score, 40);

  const safeScore = Math.max(5, Math.min(100, score));
  strengthBar.style.width = safeScore + "%";

  let label = "",
    color = "";
  if (score < 40) {
    label = "Weak";
    color = "#fc8181";
  } else if (score < 70) {
    label = "Medium";
    color = "#fbd38d";
  } else {
    label = "Strong";
    color = "#68d391";
  }
  strengthBar.style.backgroundColor = color;
  strengthLabel.textContent = label;
}

function copyPassword() {
  if (!passwordInput.value) return;
  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess());
}

function showCopySuccess() {
  copyButton.classList.replace("far", "fas");
  copyButton.classList.replace("fa-copy", "fa-check");
  copyButton.style.color = "#48bb78";
  setTimeout(() => {
    copyButton.classList.replace("fas", "far");
    copyButton.classList.replace("fa-check", "fa-copy");
    copyButton.style.color = "";
  }, 1500);
}

function showWarning(message) {
  warningCard.textContent = message;
  warningCard.style.display = "block";
  setTimeout(() => {
    warningCard.style.display = "none";
  }, 2000);
}

// Dark/Light Mode
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀️"
    : "🌙";
  updateTextColors();
}

function updateTextColors() {
  const labels = document.querySelectorAll(
    "label,#length-value,#password,#strength-label"
  );
  labels.forEach((label) => {
    if (document.body.classList.contains("dark-mode"))
      label.style.color =
        label.id == "length-value" ? "rgb(156,163,175)" : "#f0f0f0";
    else label.style.color = label.id == "length-value" ? "#000" : "#000";
  });
}
