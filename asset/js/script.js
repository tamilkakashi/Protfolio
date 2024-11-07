const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_itehq8j';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});

document.getElementById('hireButton').addEventListener('click', function() {
  const email = "arasan7102003@gmail.com"; // Replace with your email
  const subject = "Hiring Notification";
  const body = "You are hired";
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

window.addEventListener('load', function() {
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
});
