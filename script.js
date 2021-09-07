"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

function start() {
    console.log("ready");

    loadJSON();
}


function loadJSON() {
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(response => response.json())
    .then(jsonData => {
        // when loaded, prepare objects
        prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
    jsonData.forEach((elem) => {
        console.log(elem);
        // TODO: Create new object with cleaned data - and store that in the allAnimals array
        const Student = {
            firstname: "",
            middlename: "",
            nickname: "",
            lastname: "",
            house: "",
            photo: "",
        };

        const student = Object.create(Student);
        console.log(student);
        let house = elem.house.trim();

        let fullname = elem.fullname.trim();
        console.log(fullname);

        let firstname = (student.firstname = fullname.substring(fullname.lastIndexOf(), fullname.indexOf(" ")));
        console.log(fullname.indexOf(" "));

        if (fullname.indexOf(" ") >= 0) {
            console.log(fullname.indexOf(firstname));
            student.firstname = student.firstname.substring(0,1).toUpperCase() + student.firstname.substring(1).toLowerCase();
            console.log(firstname);
        } else {
            console.log("not 0")
            firstname = student.firstname = fullname.substring(fullname.indexOf(" ") + 1);
            console.log(firstname);
        }

        let middlename = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" ")); 

        if (middlename.includes('"')) {
            student.nickname = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
            console.log(student.nickname);
        } else {
            student.middlename = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
            student.middlename = student.middlename.substring(0,1).toUpperCase() + student.middlename.substring(1).toLowerCase();
            console.log(student.middlename);
            
        }

        let lastname =  (student.lastname = fullname.substring(fullname.lastIndexOf(" ") + 1));

        if (fullname.indexOf(" ") >= 0) {
            student.lastname = student.lastname.substring(0,1).toUpperCase() + student.lastname.substring(1).toLowerCase();
        } else {
            lastname = student.lastname = "";
        }
        
        console.log(student.lastname)

        student.house = house.substring(0,1).toUpperCase() + house.substring(1).toLowerCase();
        console.log(student.house);

        allStudents.push(student);
    });

    displayList();
}

function displayList() {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    allStudents.forEach(displayStudent);
}

function displayStudent(student) {
    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=firstName]").textContent = student.firstname;
    clone.querySelector("[data-field=middleName]").textContent = student.middlename;
    clone.querySelector("[data-field=nickName]").textContent = student.nickname;
    clone.querySelector("[data-field=lastName]").textContent = student.lastname;
    clone.querySelector("[data-field=house]").textContent = student.house;
    if (student.lastname.includes("-")) {
        clone.querySelector("[data-field=photo] img").src = `images/${student.lastname.substring(student.lastname.indexOf("-") + 1)}_${student.firstname[0]}.png`
        console.log(document.querySelector("[data-field=photo] img".src));
    } else if (student.lastname.includes("Patil")) {
        clone.querySelector("[data-field=photo] img").src = `images/${student.lastname}_${student.firstname}.png`;
    } else {
         clone.querySelector("[data-field=photo] img").src = `images/${student.lastname}_${student.firstname[0]}.png`
    }
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}


