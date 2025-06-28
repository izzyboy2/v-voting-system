document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("applicationForm");
  const steps = document.querySelectorAll(".form-step");
  let currentStep = 0;

  // Navigation logic
  form.querySelectorAll(".next").forEach(btn => {
    btn.onclick = () => {
      if (currentStep < steps.length - 1) {
        steps[currentStep].classList.remove("active");
        currentStep++;
        steps[currentStep].classList.add("active");
      }
    };
  });
  form.querySelectorAll(".prev").forEach(btn => {
    btn.onclick = () => {
      if (currentStep > 0) {
        steps[currentStep].classList.remove("active");
        currentStep--;
        steps[currentStep].classList.add("active");
      }
    };
  });

  // Submission logic
  form.onsubmit = async function (e) {
    e.preventDefault();

    // Collect data from all steps
    const firstName = form.querySelector('input[placeholder="First Name"]').value;
    const lastName = form.querySelector('input[placeholder="Last Name"]').value;
    const email = form.querySelector('input[placeholder="Email"]').value;
    const phone = form.querySelector('input[placeholder="Phone Number"]').value;
    const position = form.querySelector('input[placeholder="Position Applying For"]').value;
    const department = form.querySelector('input[placeholder="Department/Faculty"]').value;
    const reason = form.querySelector('textarea[placeholder="Why should students vote for you?"]').value;
    const documentFile = form.querySelector('input[type="file"]').files[0];

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("position", position);
    formData.append("department", department);
    formData.append("reason", reason);
    formData.append("document", documentFile);

    // Send to backend
    const res = await fetch("http://192.168.43.36:3000/api/apply", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      alert("Application submitted successfully!");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Submission failed.");
    }
  };
});
