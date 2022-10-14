// initial dataset for superdog event manager. this is an array of objects
const events = [
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

// builds a list of specific cities. entry point for the app
// interview question - pull a unique/distinct set out of array
function buildDropDown() {
  let eventDD = document.getElementById("eventDropDown");
  eventDD.innerHTML = "";

  // grabs template from the HTML template tag
  const template = document.getElementById("cityDD-template");

  // pulls data from database - local storage in this app example
  let curEvent = getEventData();

  // filter array by city
  // [...new Set] will return distinct list (of unique items)
  // because there are multiple properties, Set must be told which to return via Map
  // map(event)=>event.city creates for loop via anonymous function to return city names only
  let disEvent = [...new Set(curEvent.map((event) => event.city))];

  // creates HTML element to target and adds the dropdown-menu class to the new element's classList (dropdown menu taken from bootstrap)
  // recreates the HTML code:  <ul class="dropdown-menu"></ul>
  let ddUL = document.createElement("ul");
  ddUL.classList.add("dropdown-menu");

  // adds "All" option for city names to reflect aggregate data
  let ddItemNodeAll = document.importNode(template.content, true);
  let cityName = "All";
  let ddItemAll = ddItemNodeAll.querySelector("a");
  ddItemAll.textContent = cityName;
  ddItemAll.setAttribute("data-string", cityName);
  ddUL.appendChild(ddItemNodeAll);

  // only one copy per import, must re-run to change value or it will reset the same variable continuously
  for (let i = 0; i < disEvent.length; i++) {
    // pulls <li><a class="dropdown-item" onclick="getEvent(this)"></a></li> from template and assigns to ddItemNode
    let ddItemNode = document.importNode(template.content, true);
    let cityName = disEvent[i];

    // returns just <a class="dropdown-item" onclick="getEvent(this)"></a> by searching for an element containing "a" within ddItemNode
    let ddItem = ddItemNode.querySelector("a");

    // stick the city name taken from disEvent array and sticks it in the a tag, specific to text
    // ddItem.innerHTML will also work, especially for img tag, etc that may not be strictly text
    ddItem.textContent = cityName;

    // inserts a class "data-string" with attribute cityName, which was taken from the disEvent filtered array
    ddItem.setAttribute("data-string", cityName);

    // adds cityName as child item to the ddUL element
    ddUL.appendChild(ddItemNode);
  }
  // appends the modified list to the eventDD dropdown list
  eventDD.appendChild(ddUL);

  // calls 'All' results without needing to first be selected
  displayStats(curEvent);

  // loads data in lower grid
  displayInputData();
}

function getEvents(element) {
  let city = element.getAttribute("data-string");

  let curEvent = getEventData();
  let statsHdr = document.getElementById("statsHdr");
  statsHdr.innerHTML = `Stats for ${city} Events`;

  // display stats for All or selected city only
  let filteredEvents = curEvent;
  if (city !== "All") {
    // if selection != All, then filteredEvents() filters by selected city
    filteredEvents = curEvent.filter(function (item) {
      // if City property of item is equal to city filter, returns the entire item
      if (item.city == city) {
        return item;
      }
    });
  }

  displayStats(filteredEvents);
}

function displayStats(events) {
  let total = 0;
  let average = 0;
  let most = 0;
  let least = -1;

  total = totalAttendance(events);
  document.getElementById("total").innerHTML = total.toLocaleString();

  average = avgAttendance(events);
  document.getElementById("average").innerHTML = average.toLocaleString(
    "en-us",
    { minimumFractionDigits: 0, maximumFractionDigits: 0 }
  );

  most = mostAttendance(events);
  document.getElementById("most").innerHTML = most.toLocaleString();

  least = leastAttendance(events);
  document.getElementById("least").innerHTML = least.toLocaleString();
}

function totalAttendance(events) {
  let totalAttendance = 0;

  for (let i = 0; i < events.length; i++) {
    totalAttendance += events[i].attendance;
  }
  return totalAttendance;
}

function avgAttendance(events) {
  let avgAttendance = 0;
  let totalAtt = 0;

  for (let i = 0; i < events.length; i++) {
    totalAtt += events[i].attendance;
  }
  avgAttendance = totalAtt / events.length;
  return avgAttendance;
}

function mostAttendance(events) {
  let mostAttendance = 0;

  for (let i = 0; i < events.length; i++) {
    checkMost = events[i].attendance;
    if (mostAttendance < checkMost) {
      mostAttendance = checkMost;
    }
  }
  return mostAttendance;
}

function leastAttendance(events) {
  let leastAttendance = -1;

  for (let i = 0; i < events.length; i++) {
    checkLeast = events[i].attendance;

    if (leastAttendance > checkLeast || leastAttendance < 0) {
      leastAttendance = checkLeast;
    }
  }
  return leastAttendance;
}

// retrieves data from local storage
// values must be converted between JS and JSON (JS Object Notation) via 'parse' & 'stringify' as they cannot communicate as-is
function getEventData() {
  let curEvent = JSON.parse(localStorage.getItem("eventData"));

  // temporarily shoves existing data set into local storage as default value-to-be-replaced by the local Storage
  if (curEvent == null) {
    curEvent = events;
    localStorage.setItem("eventData", JSON.stringify(curEvent));
  }
  return curEvent;
}

// displays all event data in table format
function displayInputData() {
  const template = document.getElementById("eventData-template");
  // gets location where template will be written/inserted
  const inputBody = document.getElementById("inputBody");
  // prevents duplicate appends by clearing out variable prior to writing
  inputBody.innerHTML = "";

  let curEvent = getEventData();

  // sets inputRow equal to template content layout for writing to the table
  for (let i = 0; i < curEvent.length; i++) {
    let inputRow = document.importNode(template.content, true);

    // querySelector only selects first found instance, querySelectorAll selects all found 'td'
    let inputCol = inputRow.querySelectorAll("td");
    inputCol[0].textContent = curEvent[i].event;
    inputCol[1].textContent = curEvent[i].city;
    inputCol[2].textContent = curEvent[i].state;
    inputCol[3].textContent = curEvent[i].attendance;

    // dates must be formatted specially
    // toLocaleString will also format date, but with timestamp included
    let inputDate = new Date(curEvent[i].date).toLocaleDateString();
    inputCol[4].textContent = inputDate;
    inputBody.appendChild(inputRow);
  }
}

// saves new event input to local storage
function saveEventData() {
  let curEvent = getEventData();

  let newEventObj = {};

  newEventObj["event"] = document.getElementById("newEventName").value;
  newEventObj["city"] = document.getElementById("newEventCity").value;

  // the chosen option is assigned 'selected' class which can be targeted
  let stateSel = document.getElementById("newEventState");
  newEventObj["state"] = stateSel.options[stateSel.selectedIndex].text;

  newEventObj["attendance"] = parseInt(
    document.getElementById("newEventAttendance").value,
    10
  );

  let eventDate = document.getElementById("newEventDate").value;
  // date must be formatted with time to pass properly
  let eventDate2 = `${eventDate} 00:00`;
  // strips time off eventDate2 and passes along proper date format
  newEventObj["date"] = new Date(eventDate2).toLocaleDateString();

  // revises the curEvent by adding newEventObj to array end
  curEvent.push(newEventObj);

  // overwrites the original 'curEvent' object with revised object within local storage
  localStorage.setItem("eventData", JSON.stringify(curEvent));

  buildDropDown();
}
