


// headers haberberger btn=======================
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}

// Discover dropdown toggle
function toggleDropdown(event) {
    event.preventDefault(); // Default behavior रोखा
    const dropdown = document.querySelector(".dropdown-content");

    // जर आधीच उघडलेलं असेल, तर बंद करा, नाहीतर उघडा
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

// Close dropdown when clicking outside
document.addEventListener("click", function(event) {
    const dropdown = document.querySelector(".dropdown-content");
    const dropbtn = document.querySelector(".dropbtn");

    if (!dropbtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

// Close dropdown when clicking inside a link
document.querySelectorAll(".dropdown-content a").forEach(item => {
    item.addEventListener("click", function () {
        document.querySelector(".dropdown-content").style.display = "none";
    });
});


// home page linking header footer

// Function to load HTML components
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error("Error loading " + file, error));
}

// Load Header and Footer
document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "../Pages/header.html");
    loadComponent("footer", "../Pages/footer.html");
});
console.log("JS file connected successfully!");


// about page linking succesfully   

// Function to load external content into placeholders
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())  // Get file content
        .then(data => document.getElementById(id).innerHTML = data) // Insert into HTML
        .catch(error => console.error(`Error loading ${file}:`, error));
}

// Load Header and Footer
document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header-placeholder", "header.html");
    loadComponent("footer-placeholder", "footer.html");
});



// enqirey page 
function openEnquiryPage() {
    window.location.href = "enquiry.html"; // Adjust path if needed
}



    // 🔹 Logo Click Redirect to Home Page
    // setTimeout(() => {
    //     const logo = document.getElementById("logo"); 
    //     console.log("logo : ", logo);
    
    //     if (logo) {
    //         logo.addEventListener("click", function () {
    //             console.log("Logo clicked! Redirecting...");
    //             window.location.href = "home.html";
    //         });
    //     } else {
    //         console.log("Logo not found!");
    //     }
    // }, 500);
    
    setTimeout(() => {
        function addLogoClickEvent(logoId) {
            const logo = document.getElementById(logoId);
            if (logo) {
                logo.addEventListener("click", function () {
                    console.log(`${logoId} clicked! Redirecting...`);
                    window.location.href = "home.html";
                });
            }
        }
    
        addLogoClickEvent("logo"); // Navbar logo
        addLogoClickEvent("footer-logo"); // Footer logo
    
    }, 500);
    
    // Contact page Connection
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.querySelector('form');
    
        form.addEventListener('submit', (event) => {
            event.preventDefault();
    
            alert("Form submitted successfully!");
            form.reset(); // Reset form after submission
        });
    });




    // feedback page 

    
    // Rating System
    const ratingStars = document.querySelectorAll('.rating-star');
    let selectedRating = 0;

    ratingStars.forEach((star) => {
        star.addEventListener('click', () => {
            selectedRating = star.getAttribute('data-value');
            updateRating(selectedRating);
        });

        star.addEventListener('mouseenter', () => {
            const hoveredRating = star.getAttribute('data-value');
            updateRating(hoveredRating);
        });

        star.addEventListener('mouseleave', () => {
            updateRating(selectedRating);
        });
    });

    function updateRating(rating) {
        ratingStars.forEach((star) => {
            const starValue = star.getAttribute('data-value');
            if (starValue <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Form Submission
    const form = document.getElementById('testimonialForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Testimonial submitted successfully!');
    });

    // Scroll Animation for Testimonial Cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    testimonialCards.forEach((card) => {
        observer.observe(card);
    });


    // career page js 


    // Handle domain selection
function selectDomain(domain) {
    const domains = document.querySelectorAll(".domain");
    domains.forEach((el) => el.classList.remove("active"));

    const selectedDomain = Array.from(domains).find((el) => el.textContent.trim() === domain);
    if (selectedDomain) {
        selectedDomain.classList.add("active");
        document.getElementById("domain").value = domain;
    }
}


// Handle relocation selection
function selectRelocate(option) {
    const options = document.querySelectorAll(".relocate-option");
    options.forEach((el) => el.classList.remove("active"));

    const selectedOption = Array.from(options).find((el) => el.textContent === option);
    if (selectedOption) {
        selectedOption.classList.add("active");
        document.getElementById("relocate").value = option;
    }
}


// Handle form submission
document.getElementById("enquiryForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (!document.getElementById("domain").value || !document.getElementById("relocate").value) {
        alert("Please select interested domain and relocation status.");
        return;
    }

    alert("Form submitted successfully!");
    this.reset();
});
document.getElementById('instructorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;

    // ✅ Mobile Number: 10 digits validate
    if (!/^\d{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    // ✅ Email Validation (proper format check)
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    alert('Form submitted successfully!');
    this.reset(); // Form reset honar nantar
});




// FAQ 
document.querySelectorAll('.faq-item').forEach(faq => {
    faq.addEventListener('click', () => {
        faq.classList.toggle('active');
    });
});





// help and support 

document.getElementById('support-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Your request has been submitted successfully!');
    this.reset();
});

// Term Condition 

document.addEventListener("DOMContentLoaded", function () {
    const termsLink = document.getElementById("termsLink");

    if (termsLink) {
        termsLink.addEventListener("click", function (event) {
            event.preventDefault(); // Default action block करा
            window.location.href = "terms-and-conditions.html";
        });
    } else {
        console.error("⚠ Terms & Conditions link not found!");
    }
});
 

