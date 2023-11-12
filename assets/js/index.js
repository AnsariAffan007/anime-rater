import studios from "./studios.js";

// Populating history table
updateTable();

document.getElementById('predicterForm').addEventListener('submit', function (event) {
  event.preventDefault();
  let type = document.getElementById('type').value;
  let episodes = document.getElementById('episodes').value;
  let releaseYear = document.getElementById('year').value;
  let studio = document.getElementById('studio').value;
  let releaseSeason = document.getElementById('season').value;
  let warningCount = document.getElementById('warnings').value;
  let similarAnimes = document.getElementById('similarAnimes').value;
  let similarMangas = document.getElementById('similarMangas').value;
  let similarMediaCount = parseInt(similarAnimes) + parseInt(similarMangas);
  let voiceActorCount = document.getElementById('vas').value;
  let staffCount = document.getElementById('staff').value;
  let genreCount = document.getElementById('genres').value;

  let inputObj = {
    type: type,
    episodes: parseInt(episodes),
    releaseYear: parseInt(releaseYear),
    releaseSeason: releaseSeason,
    studio: studio,
    warningCount: parseInt(warningCount),
    similarAnimes: parseInt(similarAnimes),
    similarMangas: parseInt(similarMangas),
    similarMediaCount: parseInt(similarMediaCount),
    voiceActorCount: parseInt(voiceActorCount),
    staffCount: parseInt(staffCount),
    genreCount: parseInt(genreCount)
  };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", '/predict');
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.onload = () => {
    document.getElementById('rating-display').innerText = xhr.responseText;
    document.getElementById('prediction-display-container').style.opacity = 1;

    // Adding predicted rating to inputObj
    inputObj.predictedRating = xhr.responseText;
    addToLocalStorage(inputObj);
    updateTable();
  }
  xhr.send(JSON.stringify(inputObj));
})

// Populating Release Year
for (let i = 1950; i <= 2030; i++) {
  document.getElementById('year').innerHTML += `<option value="${i}">${i}</option>`
}

// Populating studios
studios.forEach(function (studio) {
  document.getElementById('studio').innerHTML += `<option value="${studio}">${studio}</option>`
})

function addToLocalStorage(row) {
  let predHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];
  predHistory.push(row);
  localStorage.setItem('predictionHistory', JSON.stringify(predHistory));
}

function updateTable() {
  let history = JSON.parse(localStorage.getItem('predictionHistory'));
  document.getElementById('table-body').innerHTML = '';
  if (history !== null) {
    history.forEach(function (row) {
      document.getElementById('table-body').innerHTML += `
      <tr>
        <td class="p-4 text-center">${row.type}</td>
        <td class="p-4 text-center">${row.episodes}</td>
        <td class="p-4 text-center">${row.releaseYear}</td>
        <td class="p-4 text-center">${row.releaseSeason}</td>
        <td class="p-4 text-center">${row.studio}</td>
        <td class="p-4 text-center">${row.warningCount}</td>
        <td class="p-4 text-center">${row.similarAnimes}</td>
        <td class="p-4 text-center">${row.similarMangas}</td>
        <td class="p-4 text-center">${row.voiceActorCount}</td>
        <td class="p-4 text-center">${row.staffCount}</td>
        <td class="p-4 text-center">${row.genreCount}</td>
        <td class="text-center"><span class="px-6 py-2 bg-slate-600 rounded-xl rate-data">${row.predictedRating}</span></td>
      </tr>
      `
    })
  }
}

document.getElementById('delete-history').addEventListener('click', function (e) {
  localStorage.clear();
  updateTable();
})

document.getElementById('about').addEventListener('click', function () {
  // Hide and show sections
  document.getElementById('main').classList.add('hidden');
  document.getElementById('about-section').classList.remove('hidden');

  // Hide and show section links
  document.getElementById('about').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
})

document.getElementById('home').addEventListener('click', function () {
  // Hide and show sections
  document.getElementById('main').classList.remove('hidden');
  document.getElementById('about-section').classList.add('hidden');

  // Hide and show section links
  document.getElementById('about').classList.remove('hidden');
  document.getElementById('home').classList.add('hidden');
})