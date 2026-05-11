const tabButtons = document.querySelectorAll(".tab-btn");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const successMessage = document.getElementById("successMessage");

const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");

const citiesByCountry = {
    Ukraine: ["Chernivtsi", "Kiyv", "Kharkiv", "Odesa", "Dnipro"],
    Poland: ["Warsaw", "Krakow", "Gdansk", "Wroclaw"],
    Germany: ["Berlin", "Munich", "Hamburg", "Cologne"],
    USA: ["New York", "Los Angeles", "Chicago", "Miami"]
};

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const tab = button.dataset.tab;

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        signupForm.classList.remove("active");
        loginForm.classList.remove("active");

        if (tab === "signup") {
            signupForm.classList.add("active");
        } else {
            loginForm.classList.add("active");
        }

        hideSuccess();
    });
});

document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "🙈";
        } else {
            input.type = "password";
            button.textContent = "👁";
        }
    });
});

countrySelect.addEventListener("change", () => {
    const selectedCountry = countrySelect.value;

    citySelect.innerHTML = `<option value="">Choose city...</option>`;
    citySelect.disabled = true;
    clearField(citySelect);

    if (selectedCountry) {
        citiesByCountry[selectedCountry].forEach((city) => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });

        citySelect.disabled = false;
    }
});

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validateSignupForm();

    if (isValid) {
        const formData = new FormData(signupForm);

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        showSuccess("Registered successfully.");
        signupForm.reset();
        resetFormStyles(signupForm);
        citySelect.disabled = true;
        citySelect.innerHTML = `<option value="">Choose city...</option>`;
    }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validateLoginForm();

    if (isValid) {
        const formData = new FormData(loginForm);

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        showSuccess("Авторизація успішна!");
        loginForm.reset();
        resetFormStyles(loginForm);
    }
});

function validateSignupForm() {
    let isValid = true;

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");
    const birthDate = document.getElementById("birthDate");
    const country = document.getElementById("country");
    const city = document.getElementById("city");
    const sex = document.querySelector('input[name="sex"]:checked');
    const sexError = document.getElementById("sexError");

    if (!validateName(firstName.value)) {
        setInvalid(firstName, "First Name має містити від 3 до 15 символів.");
        isValid = false;
    } else {
        setValid(firstName);
    }

    if (!validateName(lastName.value)) {
        setInvalid(lastName, "Last Name must have at least 3 characters.");
        isValid = false;
    } else {
        setValid(lastName);
    }

    if (!validateEmail(email.value)) {
        setInvalid(email, "Enter valid email address.");
        isValid = false;
    } else {
        setValid(email);
    }

    if (password.value.trim().length < 6) {
        setInvalid(password, "Password must have at least 6 characters.");
        isValid = false;
    } else {
        setValid(password);
    }

    if (confirmPassword.value.trim() === "") {
        setInvalid(confirmPassword, "Confirm password");
        isValid = false;
    } else if (confirmPassword.value !== password.value) {
        setInvalid(confirmPassword, "Passwords do not match.");
        isValid = false;
    } else {
        setValid(confirmPassword);
    }

    if (!validatePhone(phone.value)) {
        setInvalid(phone, "Phone number must be in format +380XXXXXXXXX.");
        isValid = false;
    } else {
        setValid(phone);
    }

    const birthValidation = validateBirthDate(birthDate.value);

    if (!birthValidation.valid) {
        setInvalid(birthDate, birthValidation.message);
        isValid = false;
    } else {
        setValid(birthDate);
    }

    if (!sex) {
        sexError.textContent = "Choose sex";
        isValid = false;
    } else {
        sexError.textContent = "";
    }

    if (!country.value) {
        setInvalid(country, "Choose countyr");
        isValid = false;
    } else {
        setValid(country);
    }

    if (!city.value) {
        setInvalid(city, "Choose city");
        isValid = false;
    } else {
        setValid(city);
    }

    return isValid;
}

function validateLoginForm() {
    let isValid = true;

    const username = document.getElementById("username");
    const password = document.getElementById("loginPassword");

    if (username.value.trim() === "") {
        setInvalid(username, "Username is required.");
        isValid = false;
    } else {
        setValid(username);
    }

    if (password.value.trim().length < 6) {
        setInvalid(password, "Password must have at least 6 characters.");
        isValid = false;
    } else {
        setValid(password);
    }

    return isValid;
}

function validateName(value) {
    const trimmedValue = value.trim();
    return trimmedValue.length >= 3 && trimmedValue.length <= 15;
}

function validateEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value.trim());
}

function validatePhone(value) {
    const phonePattern = /^\+380\d{9}$/;
    return phonePattern.test(value.trim());
}

function validateBirthDate(value) {
    if (!value) {
        return {
            valid: false,
            message: "Birth date is required."
        };
    }

    const birthDate = new Date(value);
    const today = new Date();

    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
        return {
            valid: false,
            message: "Birth date is invalid"
        };
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    if (age < 12) {
        return {
            valid: false,
            message: "You must be older than 12"
        };
    }

    return {
        valid: true,
        message: ""
    };
}

function setInvalid(field, message) {
    field.classList.remove("valid");
    field.classList.add("invalid");

    const formGroup = field.closest(".form-group");
    const error = formGroup.querySelector(".error");

    if (error) {
        error.textContent = message;
    }
}

function setValid(field) {
    field.classList.remove("invalid");
    field.classList.add("valid");

    const formGroup = field.closest(".form-group");
    const error = formGroup.querySelector(".error");

    if (error) {
        error.textContent = "";
    }
}

function clearField(field) {
    field.classList.remove("valid", "invalid");

    const formGroup = field.closest(".form-group");
    const error = formGroup.querySelector(".error");

    if (error) {
        error.textContent = "";
    }
}

function resetFormStyles(form) {
    const fields = form.querySelectorAll("input, select");
    const errors = form.querySelectorAll(".error");

    fields.forEach((field) => {
        field.classList.remove("valid", "invalid");
    });

    errors.forEach((error) => {
        error.textContent = "";
    });
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add("show");
}

function hideSuccess() {
    successMessage.textContent = "";
    successMessage.classList.remove("show");
}