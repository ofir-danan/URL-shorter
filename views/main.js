const statistic = document.getElementById("statistic");
const redirectCount = document.getElementById("redirectCount");
const creationDate = document.getElementById("creationDate");
const fullUrl = document.getElementById("urlBeforeChange");
const newUrl = document.getElementById("newUrl");

// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
statistic.onclick = function () {
  modal.style.display = "block";
  const url = document.getElementById("url_input").value;
  fetch("http://localhost:3000/api/shorturl/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })
    .then((res) => {
      return res.json();
    })
    .then((value) => {
      console.log(value);
      fullUrl.innerText = url;
      newUrl.innerText = value.shorturlId;
      creationDate.innerText = value.creationDate;
      redirectCount.innerText = value.redirectCount;
    })
    .catch((err) => (redirectCount.innerText = err));
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
