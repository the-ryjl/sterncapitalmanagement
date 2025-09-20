// Set background images from data attributes
function setBackgrounds() {
    let t;
    let e = document.querySelectorAll("*[data-bg-src]");

    if (e.length) {
        e.forEach((el) => {
            t = el.getAttribute("data-bg-src");
            el.style.backgroundImage =
                t && t !== "false" && t !== "" && t !== null ? `url(${t})` : "";
        });

        // Handle high-resolution images
        if (window.devicePixelRatio > 1.1) {
            e = document.querySelectorAll("*[data-bg-src-2x]");
            e.forEach((el) => {
                t = el.getAttribute("data-bg-src-2x");
                if (!t || t === "false") {
                    t = el.getAttribute("data-bg-src");
                }
                el.style.backgroundImage =
                    t && t !== "false" && t !== "" && t !== null ? `url(${t})` : "";
            });
        }
    }
}

// Initialize Bootstrap switch control slider
function switchControlSlider() {
    let t, e;
    const r = document.querySelectorAll(".form-switch input[data-bs-target]");
    const a = {};

    if (r.length) {
        r.forEach((input) => {
            t = document.querySelector(input.getAttribute("data-bs-target"));
            e = new bootstrap.Carousel(t, { interval: false, touch: false });

            a[input.getAttribute("data-bs-target")] = e;

            input.addEventListener("change", function () {
                a[this.getAttribute("data-bs-target")].next();
                a[this.getAttribute("data-bs-target")].pause();
            });
        });
    }
}

// Stop YouTube videos on modal close
function stopYouTubeOnModalClose() {
    let t;
    const e = document.querySelectorAll(".modal");

    if (e.length) {
        e.forEach((modal) => {
            t = modal.querySelector("iframe");

            if (
                t &&
                (t.src.indexOf("youtube.com") !== -1 ||
                    t.src.indexOf("youtu.be") !== -1)
            ) {
                modal.addEventListener("hide.bs.modal", function () {
                    const iframe = this.querySelector("iframe");
                    iframe.setAttribute("data-src", iframe.src);
                    iframe.src = "";

                    setTimeout(() => {
                        iframe.src = iframe.getAttribute("data-src");
                    }, 100);
                });
            }
        });
    }
}

// Initialize animations with AOS (Animate on Scroll)
function initAnimations(duration) {
    if (typeof AOS !== "undefined") {
        if (!duration) duration = 500;
        AOS.init({
            easing: "ease-out-cubic",
            once: true,
            offset: 50,
            duration: duration,
        });
    }
}

// Initialize AJAX forms with Google reCAPTCHA
function ajaxFormInit() {
    const forms = document.querySelectorAll("form.js-ajax-form");

    if (forms.length) {
        forms.forEach((form) => {
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                if (form.getAttribute("data-sitekey")) {
                    let r = form.querySelector("input[name='g-recaptcha-response']");

                    if (r) {
                        document.querySelector(".grecaptcha-badge").style.display =
                            "block";
                        grecaptcha
                            .execute(form.getAttribute("data-sitekey"), {
                                action: "submit",
                            })
                            .then((token) => {
                                r.setAttribute("value", token);
                                ajaxFormSubmit(form);
                            });
                    } else {
                        let a = document.getElementById(
                            "grecaptcha-" + form.getAttribute("data-sitekey")
                        );

                        if (a) {
                            document.querySelector(".grecaptcha-badge").style.display =
                                "block";
                            grecaptcha
                                .execute(form.getAttribute("data-sitekey"), {
                                    action: "submit",
                                })
                                .then((token) => {
                                    r = document.createElement("input");
                                    r.setAttribute("type", "hidden");
                                    r.setAttribute("name", "g-recaptcha-response");
                                    r.setAttribute("value", token);
                                    form.append(r);
                                    ajaxFormSubmit(form);
                                });
                        } else {
                            const head = document.querySelector("head");
                            a = document.createElement("script");
                            a.setAttribute(
                                "src",
                                "https://www.google.com/recaptcha/api.js?render=" +
                                    form.getAttribute("data-sitekey")
                            );
                            a.setAttribute(
                                "id",
                                "grecaptcha-" + form.getAttribute("data-sitekey")
                            );

                            a.addEventListener("load", () => {
                                grecaptcha.ready(() => {
                                    grecaptcha
                                        .execute(form.getAttribute("data-sitekey"), {
                                            action: "submit",
                                        })
                                        .then((token) => {
                                            r = document.createElement("input");
                                            r.setAttribute("type", "hidden");
                                            r.setAttribute(
                                                "name",
                                                "g-recaptcha-response"
                                            );
                                            r.setAttribute("value", token);
                                            form.append(r);
                                            ajaxFormSubmit(form);
                                        });
                                });
                            });

                            head.append(a);
                        }
                    }
                } else {
                    ajaxFormSubmit(form);
                }
            });
        });
    }
}

// AJAX form submit handler
function ajaxFormSubmit(form) {
    const e = new FormData(form);

    if (form.method.toLowerCase() !== "post") {
        return ajaxFormSubmitResult(
            'AJAX form submit works only with the "post" method set.',
            form
        );
    }

    // Validate required fields
    const invalid = Array.from(form.querySelectorAll("input, textarea, select")).some(
        (el) =>
            (el.required && el.value === "") ||
            (el.required && el.type === "checkbox" && el.checked === false) ||
            el.validity.valid !== true
    );

    if (invalid) {
        return ajaxFormSubmitResult(
            "Not all required fields were filled or filled incorrectly.",
            form
        );
    }

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("loadend", function () {
        if (xhr.status !== 200) {
            ajaxFormSubmitResult("Error: HTTP status code is " + xhr.status, form);
        } else {
            ajaxFormSubmitResult(xhr.responseText, form);
        }
    });

    xhr.addEventListener("timeout", function () {
        ajaxFormSubmitResult("Request timed out, data was not sent.", form);
    });

    xhr.open(form.method, form.action);
    xhr.send(e);
}

// Handle AJAX form result
function ajaxFormSubmitResult(response, form) {
    const results = form.querySelectorAll(".js-form-result");
    let message = "";

    try {
        JSON.parse(response);
    } catch (err) {
        console.error(response);
        return ajaxFormShowResult(false, (message = response), results);
    }

    response = JSON.parse(response);

    if (response.success) {
        if (response.success === true) {
            message = form
                .querySelector(
                    ".js-form-result[data-result='success'] .js-form-alert-text"
                )
                .getAttribute("data-default-text");
        } else {
            message = response.success;
        }
        ajaxFormShowResult(true, message, results);
    } else if (response.error) {
        message = response.error;
        console.error(response);
        ajaxFormShowResult(false, message, results);
    } else {
        message = "Unknown error. Please, check if your hosting supports PHP.";
        console.error(message);
        ajaxFormShowResult(false, message, results);
    }
}

// Display AJAX form results
function ajaxFormShowResult(success, message, results) {
    if (results.length) {
        results.forEach((r) => {
            if (
                (success && r.getAttribute("data-result") === "success") ||
                (!success && r.getAttribute("data-result") === "error")
            ) {
                r.classList.remove("invisible");
                r.classList.add("show");
                r.querySelector(".js-form-alert-text").innerText = message;

                setTimeout(() => {
                    r.classList.remove("show");
                    r.addEventListener("transitionend", function () {
                        if (!this.classList.contains("show")) {
                            this.classList.add("invisible");
                        }
                    });
                    if (document.querySelector(".grecaptcha-badge")) {
                        document.querySelector(".grecaptcha-badge").style.display =
                            "none";
                    }
                }, 5000);
            } else {
                r.classList.add("invisible");
                r.classList.remove("show");
            }
        });
    }
}

// Run on DOM ready
document.addEventListener("DOMContentLoaded", function () {
    setBackgrounds();
    switchControlSlider();
    stopYouTubeOnModalClose();
    initAnimations();
    ajaxFormInit();
});
