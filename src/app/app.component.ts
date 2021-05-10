import { Component } from '@angular/core';
import * as  match_data  from  './matchdata/matches.json';
import * as game_data from './matchdata/dictionary.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  matchData = match_data.matches.slice(0,20);
  gameMode = game_data.gamemodes;
  gameMap = game_data.maps;

  displayMatchData = this.matchData;
  sortValue = "MOST RECENT";
  modeValue = "ALL MODES";
  mapValue = "ALL MAPS";

  dayDict = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
  }

  // function that returns the key value of selected game mode
  public getModeKey(val) {
    for (let key in this.gameMode) {
      if (this.gameMode[key] === val)
        return key;
    }
  }

  // function that returns the key value of selected game map
  public getMapKey(val) {
    for (let key in this.gameMap) {
      if (this.gameMap[key] === val)
        return key;
    }
  }

  // function that determines what value to sort by
  public sortSelected(event) {
    this.sortValue = event.target.value;
    this.filterData();
  }

  // function that determines what mode to filter by
  public modeSelected(event) {
    this.modeValue = event.target.value;
    this.filterData();
  }

  // function that determines what map to filter by
  public mapSelected(event) {
    this.mapValue = event.target.value;
    this.filterData();
  }

  // function that sorts and filters by user selected values
  public filterData() {
    let filteredData = this.matchData;

    // apply sorting by date
    if (this.sortValue === "MOST RECENT") {
      filteredData = filteredData.sort((d1, d2) => d2["matchDate"] - d1["matchDate"]);
    }

    // apply sorting by elims
    if (this.sortValue === "MOST ELIMS") {
      filteredData = filteredData.sort((d1, d2) => d2["playerStats"].ekia - d1["playerStats"].ekia);
    }

    // apply sorting by SPM
    if (this.sortValue === "HIGHEST SPM") {
      filteredData = filteredData.sort((d1, d2) => d2["playerStats"].scorePerMinute - d1["playerStats"].scorePerMinute);
    }

    // apply filtering by mode
    if (this.modeValue != "ALL MODES") {
      const modeKey = this.getModeKey(this.modeValue);
      filteredData = filteredData.filter(item => item["mode"] === modeKey);  
    }
  
    // apply filtering by map
    if (this.mapValue != "ALL MAPS") {
      const mapKey = this.getMapKey(this.mapValue);
      filteredData = filteredData.filter(item => item["map"] === mapKey);
    }
    this.displayMatchData = filteredData;
  }

  ngOnInit() {
    // convert matchDate to specific string format
    for (let i = 0; i < this.matchData.length; i++) {
      const date = new Date(this.matchData[i].matchDate * 1000)
      const day = this.dayDict[date.getDay()];
      const splitTime = date.toLocaleTimeString().split(/:| /);
      const time = splitTime[0] + ':' + splitTime[1] + ' ' + splitTime[3];
      const convertedDate = day + " at " + time;
      this.matchData[i]['convertedDate'] = convertedDate;
    }
  }

}
