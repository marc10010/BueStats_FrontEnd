export const environment = {
  production: true,
  //apiUrl: 'http://127.0.0.1:5000/',
  //streamlit: 'http://127.0.0.1:8501',
  streamlit: 'http://buestats.redirectme.net:8502/',
  apiUrl: 'https://buestats.redirectme.net:5000/api/',
  htmlCalendar: 'https://baloncestoenvivo.feb.es/calendario/',
  getSeasons:'getSeasonsByLeague',
  getGroups: 'getGroupsBySeasonLeague',
  getBasicInfo: 'basicInfoLeagues',
  getAllTeams:'getAllTeamsByLeagueYear',
  getWeeksMatch:'getMatchWeeksFromSeasonLeague',
  createCsv:'createCsv',
};
