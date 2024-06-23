AOS.init({
  duration: 1500,
})

//Initializing tooltip
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// Showing error icon on input field when user enters any other characters
const inputContainers = document.querySelectorAll(".input-container");
const submitButton = document.getElementById("submitBtn");

for (const container of inputContainers) {
  const inputField = container.querySelector(".numeric-input");
  const tooltipIcon = container.querySelector(".tooltip-icon");

  inputField.addEventListener("input", function () {
    const value = inputField.value;
    const isValid = /^\d*$/.test(value); // Regular expression to check if the value contains only numbers
    const isEmpty = value === "";
    if (isValid && !isEmpty) {
      tooltipIcon.classList.add("d-none"); // Hide the tooltip icon if input is valid or empty
    } else {
      tooltipIcon.classList.remove("d-none"); // Show the tooltip icon if input is invalid
      if (isEmpty) {
        tooltipIcon.setAttribute(
          "data-bs-original-title",
          "Please fill this field"
        ); // Change tooltip title for empty input
      } else {
        tooltipIcon.setAttribute(
          "data-bs-original-title",
          "Please enter numbers only"
        ); // Change tooltip title for invalid input
      }
    }
  });

  // For checking if user filled each input field
  submitButton.addEventListener("click", (event) => {
    if (inputField.value === "") {
      tooltipIcon.classList.remove("d-none");
      tooltipIcon.setAttribute(
        "data-bs-original-title",
        "Please fill this field"
      ); // Change tooltip title for empty input
      event.preventDefault(); // Prevent form submission if any input field is empty
    }
  });
}

// For checking if user has selected any age group
const ageGroup = document.getElementById("inputState");
const ageErrorIcon = document.getElementById("ageErrorIcon");
submitButton.addEventListener("click", function (event) {
  for (const container of inputContainers) {
    const inputField = container.querySelector(".numeric-input");
    const value = inputField.value;

    if (!/^\d*$/.test(value)) {
      event.preventDefault(); // Prevent form submission if any input field contains non-numeric characters
      break; // Exit loop early if invalid input is found
    }
  }

  // Show error icon for age group if not selected
  if (ageGroup.value === "") {
    ageErrorIcon.classList.remove("d-none");
    event.preventDefault(); // Prevent form submission if age group is not selected
  } else {
    ageErrorIcon.classList.add("d-none");
  }
});

// Show and hide the ageError icon
ageGroup.addEventListener("change", () => {
  if (ageGroup.value === "") {
    ageErrorIcon.classList.remove("d-none");
  } else {
    ageErrorIcon.classList.add("d-none");
  }
});

// Formula logic to calculate the overall income
const form = document.getElementById("form");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get input values as a whole number
  const grossAnnualIncome = parseInt(document.getElementById("gross-annual-income").value);
  const extraIncome = parseInt(document.getElementById("extra-income").value);
  const totalDeductions = parseInt(document.getElementById("deductions").value);
  const ageGroup = document.getElementById("inputState").value; // Retrieve the selected value of the age group
  let overallIncomeElement = document.getElementById('overall-income') // Get the element in which we want to show the overall income

  // Calculate total income
  const totalIncome = grossAnnualIncome + extraIncome - totalDeductions;

  // Calculate taxable income
  const taxableIncome = totalIncome > 800000 ? totalIncome - 800000 : 0; //Ensure taxable income is not negative

  let taxAmount = 0;

  // Apply tax rates based on age group
  if (totalIncome > 800000) {
    if (ageGroup === "under40") {
      taxAmount = taxableIncome * 0.3;
    } else if (ageGroup === "40to60") {
      taxAmount = taxableIncome * 0.4;
    } else if (ageGroup === "over60") {
      taxAmount = taxableIncome * 0.1;
    }
  }

  // Calculate overall income after tax deductions
  let ovrerallIncome = totalIncome - taxAmount

  // Show the modal only if all input fields are valid
  if (ovrerallIncome >= 0) {
    // If overall income is valid, show the modal
    // Format the overall income using commas for better readability and assign it to the element where we want to display the overall income
    overallIncomeElement.textContent = ovrerallIncome.toLocaleString('en-IN');
    const modal = new bootstrap.Modal(document.getElementById("resultModal"));
    modal.show();
  } else {
      // If overall income is invalid, prevent the default form submission
      event.preventDefault();
  }
});

// For background Image
function updateBodyHeight() {
  document.body.style.height = `${window.innerHeight}px`;
}

// Update the height initially and on resize
window.addEventListener('resize', updateBodyHeight);
updateBodyHeight();
