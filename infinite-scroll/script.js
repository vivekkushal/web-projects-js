const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
const count = 30;
const apiKey = process.env.API_ACCESS_KEY;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;

// Check if image is loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    console.log("ready =", ready);
  }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links & photos, add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  console.log("total images", totalImages);

  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> link to Unsplash
    const linkElement = document.createElement("a");
    // linkElement.setAttribute("href", photo.links.html);
    // linkElement.setAttribute("style", "none");
    // linkElement.setAttribute("target", "_blank");
    setAttributes(linkElement, {
      href: photo.links.html,
      style: "text-decoration: none",
      target: "_blank",
    });

    // Create <img> for photo
    const imageElement = document.createElement("img");
    // imageElement.setAttribute("src", photo.urls.regular);
    // imageElement.setAttribute("alt", photo.alt_description);
    // imageElement.setAttribute("title", photo.alt_description);
    setAttributes(imageElement, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Event listener, check when each photo is finished loading
    imageElement.addEventListener("load", imageLoaded);

    // Put imageElement inside linkElement, then put both inside imageContainer
    linkElement.appendChild(imageElement);
    imageContainer.appendChild(linkElement);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    // Catch error
    console.log(error);
  }
}

// Infinite scroll - Keystone feature
// Check to see if scrollling near the bottom of the page loads more image
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On load
getPhotos();
