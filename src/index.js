let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    // Toggle the form visibility
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys when the page loads
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToyCard(toy);
      });
    });

  // Handle form submission to add a new toy
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;

    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
      renderToyCard(newToy);
      toyForm.reset();
      toyFormContainer.style.display = "none";
    });
  });

  // Function to render a toy card
  function renderToyCard(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";

    const toyName = document.createElement("h2");
    toyName.textContent = toy.name;

    const toyImage = document.createElement("img");
    toyImage.src = toy.image;
    toyImage.className = "toy-avatar";

    const toyLikes = document.createElement("p");
    toyLikes.textContent = `${toy.likes} Likes`;

    const likeBtn = document.createElement("button");
    likeBtn.className = "like-btn";
    likeBtn.id = toy.id;
    likeBtn.textContent = "Like ❤️";

    likeBtn.addEventListener("click", () => {
      toy.likes += 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ likes: toy.likes })
      })
      .then(response => response.json())
      .then(updatedToy => {
        toyLikes.textContent = `${updatedToy.likes} Likes`;
      });
    });

    toyCard.append(toyName, toyImage, toyLikes, likeBtn);
    toyCollection.appendChild(toyCard);
  }
});
