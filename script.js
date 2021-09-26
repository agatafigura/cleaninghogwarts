"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
const expelledStudents = [];

const Student = {
  firstname: "",
  middlename: "",
  nickname: "",
  lastname: "",
  house: "",
  photo: "",
  squad: false,
  perfect: false,
  status: false,
  blood: "half",
  gender: "",
};

const settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

function start() {
  console.log("ready");
  registerButtons();
  loadJSON();
}

function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
    document.querySelector("#searchbar").addEventListener("input", search);
}

//search bar

function search(e) {
  const searchString = e.target.value.toLowerCase();
  const searchedStudents = allStudents.filter((student) => {
    return student.firstname.toLowerCase().includes(searchString) || student.lastname.toLowerCase().includes(searchString);
  });
  displayList(searchedStudents);
}

function loadJSON() {
  Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((resp) =>
      resp.json()
    ),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((resp) =>
      resp.json()
    ),
  ]).then((jsonData) => {
    console.log(jsonData);
    prepareObjects(jsonData[0], jsonData[1]);
  });
}

function prepareObjects(jsonData1, jsonData2) {
  console.log(jsonData1);
  console.log(jsonData2);
  jsonData1.forEach((elem) => {

    const student = Object.create(Student);

    let house = elem.house.trim();

    let fullname = elem.fullname.trim();

    let gender = elem.gender.trim();

    let firstname = (student.firstname = fullname.substring(
      fullname.lastIndexOf(),
      fullname.indexOf(" ")
    ));

    if (fullname.indexOf(" ") >= 0) {
      student.firstname =
        student.firstname.substring(0, 1).toUpperCase() +
        student.firstname.substring(1).toLowerCase();
    } else {
      firstname = student.firstname = fullname.substring(
        fullname.indexOf(" ") + 1
      );
    }

    let middlename = fullname.substring(
      fullname.indexOf(" ") + 1,
      fullname.lastIndexOf(" ")
    );

    if (middlename.includes('"')) {
      student.nickname = fullname.substring(
        fullname.indexOf(" ") + 1,
        fullname.lastIndexOf(" ")
      );
    } else {
      student.middlename = fullname.substring(
        fullname.indexOf(" ") + 1,
        fullname.lastIndexOf(" ")
      );
      student.middlename =
        student.middlename.substring(0, 1).toUpperCase() +
        student.middlename.substring(1).toLowerCase();
    }

    let lastname = (student.lastname = fullname.substring(
      fullname.lastIndexOf(" ") + 1
    ));

    if (fullname.indexOf(" ") >= 0) {
      student.lastname =
        student.lastname.substring(0, 1).toUpperCase() +
        student.lastname.substring(1).toLowerCase();
    } else {
      lastname = student.lastname = "";
    }

    student.house =
      house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();
    // console.log(student.house);

    student.gender = gender;
    student.gender = student.gender.substring(0, 1).toUpperCase() + student.gender.substring(1).toLowerCase();

    const array = Object.values(jsonData2);
    for (let i = 0; i < 2; i ++) {
      if (array[i].includes(lastname)) {
        if (i == 1) {
          student.blood = "pure";
        }
      }
    }

    allStudents.push(student);
  });

  buildList();
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledStudents;
  } else if (settings.filterBy === "nonexpelled") {
    filteredList = allStudents.filter(isNonExpelled);
  } else if (settings.filterBy === "pure-blooded") {
    filteredList = allStudents.filter(isPureBlooded);
  } else if (settings.filterBy === "half-blooded") {
    filteredList = allStudents.filter(isHalfBlooded);
  }

  return filteredList;
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isNonExpelled(student) {
  return student.status === false;
}

function isPureBlooded(student) {
  return student.blood === "pure";
}

function isHalfBlooded(student) {
  return student.blood === "half";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find old sortBy element and remove it
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortBy");

  //indicate active sort
  event.target.classList.add("sortBy");

  //toggle direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    console.log(`Sorting by ${settings.sortBy}`);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);

  document.querySelector("#number").textContent = students.length;
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=middleName]").textContent = student.middlename;
  clone.querySelector("[data-field=nickName]").textContent = student.nickname;
  clone.querySelector("[data-field=lastName]").textContent = student.lastname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=status]").dataset.status = student.status;
  clone.querySelector("[data-field=squad").dataset.squad = student.squad;
  clone.querySelector("#expell").addEventListener("click", expellStudent);

  //photos

  if (student.lastname.includes("-")) {
    clone.querySelector(
      "[data-field=photo] img"
    ).src = `images/${student.lastname.substring(
      student.lastname.indexOf("-") + 1
    ).toLowerCase}_${student.firstname[0].toLowerCase}.png`;
  } else if (student.lastname.includes("Patil")) {
    clone.querySelector(
      "[data-field=photo] img"
    ).src = `images/${student.lastname}_${student.firstname}.png`;
  } else {
    clone.querySelector(
      "[data-field=photo] img"
    ).src = `images/${student.lastname}_${student.firstname[0]}.png`;
  }
  if (student.firstname === "Agata") {
    clone.querySelector("[data-field=photo] img").src = `images/foto.jpg`;
    clone.querySelector("[data-field=photo] img").style.width = "108px";
    clone.querySelector("[data-field=photo] img").style.borderRadius = "10%";
  }

    //expelling function
    function expellStudent() {
      if (student.firstname !== "Agata") {
        student.status = true;

        const indexOfCurrentStudent = allStudents.findIndex((element) => element.firstname === student.firstname);
        const arrayOfRemovedStudents = allStudents.splice(indexOfCurrentStudent, 1);

        expelledStudents.push(arrayOfRemovedStudents[0]);
        buildList();
    } else if (student.firstname === "Agata") {
      cannotExpell();
    }
    }

    function cannotExpell() {
      console.log("cant expell");
      document.querySelector("#cannotexpell").classList.remove("hidden");
      document
      .querySelector("#cannotexpell #ok")
      .addEventListener("click", closeDialog);

    function closeDialog() {
      document.querySelector("#cannotexpell").classList.add("hidden");
      document
        .querySelector("#cannotexpell #ok")
        .removeEventListener("click", closeDialog);
    }
    }

  //adding to squad function
  clone.querySelector("[data-field=squad]").dataset.squad = student.squad;
  clone
    .querySelector("[data-field=squad]")
    .addEventListener("click", checkIfPureBloodOrSlytherin);

  function checkIfPureBloodOrSlytherin() {
    if (student.house === "Slytherin") {
      addToSquad(student);
    } else if (student.blood === "pure") {
      addToSquad(student);
    } else {
      cannotAddToSquad();
    }
  }

  function addToSquad() {
    if (student.squad === true) {
      student.squad = false;
    } else {
      student.squad = true;
    }
    buildList();
  }

  function cannotAddToSquad() {
    console.log("cannot add to squad");
    document.querySelector("#cannotaddtosquad").classList.remove("hidden");
    document
      .querySelector("#cannotaddtosquad #ok")
      .addEventListener("click", closeDialog);

    function closeDialog() {
      document.querySelector("#cannotaddtosquad").classList.add("hidden");
      document
        .querySelector("#cannotaddtosquad #ok")
        .removeEventListener("click", closeDialog);
    }
  }

  //adding perfects function
  clone.querySelector("[data-field=perfect]").dataset.perfect = student.perfect;
  clone
    .querySelector("[data-field=perfect]")
    .addEventListener("click", choosePerfect);

  function choosePerfect() {
    if (student.perfect === true) {
      student.perfect = false;
    } else {
      tryToMakePerfect(student);
    }
    buildList();
  }

  // //changing text on buttons *doesnt work*

  // clone
  // .querySelector("#make-a-prefect")
  // .addEventListener("click", changeButtonText);

  // function changeButtonText() {
  //   var prefectButton = document.querySelector("#make-a-prefect");

  //   if (prefectButton.value === "Make a prefect") {
  //     prefectButton.value = "Remove prefect status";
  //     console.log(prefectButton.value);
  //   } else if (prefectButton.value === "Remove prefect status") {
  //     prefectButton.value = "Make a prefect";
  //     console.log(prefectButton.value);
  //   }
  // }

  //pop up

  let button = clone.querySelector("#seemore");
  button.addEventListener("click", seeMore);

  function seeMore() {
    console.log("see more");
    document.querySelector("#popup").classList.remove("hidden");
    document
      .querySelector("#popup .closebutton")
      .addEventListener("click", closeDialog);
    showMoreInfo();
  }

  function closeDialog() {
    document.querySelector("#popup").classList.add("hidden");
    document
      .querySelector("#popup .closebutton")
      .removeEventListener("click", closeDialog);
  }

  function showMoreInfo() {

    //crest 
      let crest = document.querySelector("#popup #crest");

      if (student.house === "Gryffindor") {
        crest.src = "gryffindor.png";
      } else if (student.house === "Slytherin") {
        crest.src = "slytherin.png";
      } else if (student.house === "Ravenclaw") {
        crest.src = "ravenclaw.png";
      } else if (student.house === "Hufflepuff") {
        crest.src = "hufflepuff.png";
      }
    

    //name
    document.querySelector("#popup h1").textContent =
      student.firstname +
      " " +
      student.nickname +
      " " +
      student.middlename +
      " " +
      student.lastname;

    //img
    document.querySelector(
      "#popup #photo"
    ).src = `images/${student.lastname.substring(
      student.lastname.indexOf("-") + 1
    )}_${student.firstname[0]}.png`;

    //gender
    document.querySelector("#popup #gender").textContent = student.gender;

    //house
    document.querySelector("#popup #house").textContent = student.house;

    //squad
    let squadStatus = document.querySelector("#squad-member");

    if (student.squad === false) {
        squadStatus.style.filter = "grayscale(1)";
    } else if (student.squad === true) {
        squadStatus.style.filter = "grayscale(0)";
    }

    //prefects
    let prefectStatus = document.querySelector("#features #prefect-status");

    if (student.perfect === false) {
        prefectStatus.style.filter = "grayscale(1)";
    } else if (student.perfect === true) {
        prefectStatus.stylefilter = "grayscale(0)";
    }

    //expelled
    let expelledStatus = document.querySelector("#expelled-status");

    if (student.status === false) {
        expelledStatus.textContent = "Not expelled";
    } else if (student.status === true) {
        expelledStatus.textContent = "Expelled";
    }

    //blood
    let bloodStatus = document.querySelector("#blood");

    if (student.blood === "half") {
      bloodStatus.textContent = "Half-blood";
    } else if (student.blood === "pure") {
      bloodStatus.textContent = "Pure-blood";
    } else {
      bloodStatus.textContent = "Muggle-blood";
    }


    //background colors of popup
    let popUp = document.querySelector("#popup #dialog");
    let span1 = document.querySelector(".span1");
    let span2 = document.querySelector(".span2");
    let span3 = document.querySelector(".span3");
    let span4 = document.querySelector(".span4");
    let name = document.querySelector("#student-name");

    let closebutton = document.querySelector("#popup #dialog button");

    if (student.house === "Gryffindor") {
      popUp.style.backgroundColor = "#D3A625";
      popUp.style.border = "5px solid #740001";
      span1.style.color = "#740001";
      span2.style.color = "#740001";
      span3.style.color = "#740001";
      span4.style.color = "#740001";
      name.style.color = "#740001";
      closebutton.style.backgroundColor = "#740001";
    } else if (student.house === "Slytherin") {
      popUp.style.backgroundColor = "#AAAAAA";
      popUp.style.border = "5px solid #2A623D"
      span1.style.color = "#2A623D";
      span2.style.color = "#2A623D";
      span3.style.color = "#2A623D";
      span4.style.color = "#2A623D";
      name.style.color = "#2A623D"
      closebutton.style.backgroundColor = "#2A623D";
    } else if (student.house === "Ravenclaw") {
      popUp.style.backgroundColor = "#5D5D5D";
      popUp.style.border = "5px solid #222F5B"
      span1.style.color = "#222F5B";
      span2.style.color = "#222F5B";
      span3.style.color = "#222F5B";
      span4.style.color = "#222F5B";
      name.style.color = "#222F5B";

      closebutton.style.backgroundColor = "#222F5B";
    } else if (student.house === "Hufflepuff") {
      popUp.style.backgroundColor = "#60605C";
      popUp.style.border = "5px solid #FFDB00"
      span1.style.color = "#FFDB00";
      span2.style.color = "#FFDB00";
      span3.style.color = "#FFDB00";
      span4.style.color = "#FFDB00";
      name.style.color = "#FFDB00";
      closebutton.style.backgroundColor = "#FFDB00";
    }
}

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

//making prefects function

function tryToMakePerfect(selectedStudent) {
  const perfects = allStudents.filter((student) => student.perfect);
  const numberOfPerfects = perfects.length;
  console.log(perfects);

  if (numberOfPerfects >= 2) {
    console.log(`There can only be 2 prefects in each house`);
    removeAorB(perfects[0], perfects[1]);
  } else {
    makePerfect(selectedStudent);
  }

  //removing prefects

  function removeAorB(studentA, studentB) {
    document.querySelector("#remove-aorb").classList.remove("hidden");
    document
      .querySelector("#remove-aorb .closebutton")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#remove-aorb #removea")
      .addEventListener("click", clickRemoveA);
    document
      .querySelector("#remove-aorb #removeb")
      .addEventListener("click", clickRemoveB);

    //show names on buttons
    document.querySelector("#remove-aorb [data-field=studentA]").textContent =
      studentA.firstname;
    document.querySelector("#remove-aorb [data-field=studentB]").textContent =
      studentB.firstname;

    //if ignore
    function closeDialog() {
      document.querySelector("#remove-aorb").classList.add("hidden");
      document
        .querySelector("#remove-aorb .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove-aorb #removea")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove-aorb #removeb")
        .removeEventListener("click", clickRemoveB);
    }

    //if removeA
    function clickRemoveA() {
      removePerfect(studentA);
      makePerfect(selectedStudent);
      buildList();
      closeDialog();
    }

    //if remove B
    function clickRemoveB() {
      removePerfect(studentB);
      makePerfect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePerfect(perfectStudent) {
    perfectStudent.perfect = false;
  }

  function makePerfect(student) {
    student.perfect = true;
  }
}

document.querySelector("#hack-button").addEventListener("click", hackTheSystem);

function hackTheSystem() {
  addNewStudent();
  allStudents.forEach(randomizeBlood);
  // limitedSquad();
}

function addNewStudent() {
  console.log("new student added");
  let newStudent = {};
  newStudent.firstname = "Agata";
  newStudent.middlename = "";
  newStudent.nickname = "";
  newStudent.lastname = "Figura";
  newStudent.house = "Slytherin";
  newStudent.gender = "Girl";
  newStudent.perfect = false;
  newStudent.squad = false;
  newStudent.status = false;
  newStudent.blood = "pure";

  allStudents.push(newStudent);
  buildList();
}

function randomizeBlood(student) {
  if (student.blood === "pure") {
    const bloodTypes = ["Muggle-blood", "half"];
    const randomNumber = Math.floor(Math.random() * 2);
    student.blood = bloodTypes[randomNumber];
  } else if (student.blood === "half") {
    student.blood = "pure";
  }
}

// function limitedSquad() {
//   let squadButton = document.querySelector("#add-to-squad");
//   squadButton.addEventListener("click", addForTwoSeconds)

//   function addForTwoSeconds() {
//     if (student.squad === false) {
//       student.squad = true;
//       setTimeout(removeFromSquad, 2000);
//     } else {
//       student.squad = false;
//     }
//   }

//   function removeFromSquad() {
//     student.squad = false;
//   }
// }