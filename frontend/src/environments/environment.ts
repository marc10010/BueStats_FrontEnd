// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:5000/',
  streamlit: 'http://127.0.0.1:8501',
  //streamlit: 'http://buestats.redirectme.net:8502/',
  //apiUrl: 'https://buestats.redirectme.net:5000/api/',
  htmlCalendar: 'https://baloncestoenvivo.feb.es/calendario/',
  getSeasons:'getSeasonsByLeague',
  getGroups: 'getGroupsBySeasonLeague',
  getBasicInfo: 'basicInfoLeagues',
  getAllTeams:'getAllTeamsByLeagueYear',
  getWeeksMatch:'getMatchWeeksFromSeasonLeague',
  createCsv:'createCsv_new',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
