function displayMessage() {
  let message = document.getElementById("message").value;
  //alert(message);

  Swal.fire({
    backdrop: false,
    title: "App name",
    text: message,
  });
}
