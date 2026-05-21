const LOCATION_HIERARCHY = {
  "Maharashtra": {
    "Pune": {
      lat: 18.5204, lon: 73.8567,
      areas: ["Shivajinagar", "Kothrud", "Hinjewadi", "Viman Nagar"]
    },
    "Mumbai": {
      lat: 19.0760, lon: 72.8777,
      areas: ["Andheri", "Bandra", "Colaba", "Dadar"]
    }
  },
  "Gujarat": {
    "Ahmedabad": {
      lat: 23.0225, lon: 72.5714,
      areas: ["Navrangpura", "Bopal", "Satellite"]
    },
    "Surat": {
      lat: 21.1702, lon: 72.8311,
      areas: ["Adajan", "Varachha", "Vesu"]
    }
  },
  "Karnataka": {
    "Bengaluru": {
      lat: 12.9716, lon: 77.5946,
      areas: ["Koramangala", "Indiranagar", "Whitefield", "Jayanagar"]
    }
  },
  "Delhi": {
    "New Delhi": {
      lat: 28.6139, lon: 77.2090,
      areas: ["Connaught Place", "Hauz Khas", "Saket", "Vasant Kunj"]
    }
  }
};

const STATE_CITY_MAP = {
  "Maharashtra": [{ name: "Mumbai", lat: 19.0760, lon: 72.8777 }, { name: "Pune", lat: 18.5204, lon: 73.8567 }],
  "Gujarat": [{ name: "Ahmedabad", lat: 23.0225, lon: 72.5714 }, { name: "Surat", lat: 21.1702, lon: 72.8311 }],
  "Karnataka": [{ name: "Bengaluru", lat: 12.9716, lon: 77.5946 }],
  "Delhi": [{ name: "New Delhi", lat: 28.6139, lon: 77.2090 }]
};

const ALL_INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh",
  "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

ALL_INDIAN_STATES.forEach(state => {
  if (!LOCATION_HIERARCHY[state]) {
    // Deterministic random-like coordinates based on string length
    const baseLat = 20.0 + (state.length % 5);
    const baseLon = 77.0 + (state.length % 5);
    LOCATION_HIERARCHY[state] = {
      [`${state} Capital Region`]: {
        lat: baseLat, lon: baseLon,
        areas: ["Central Zone", "North Zone", "South Zone"]
      },
      [`${state} Sub-District`]: {
        lat: baseLat + 0.5, lon: baseLon + 0.5,
        areas: ["Sector 1", "Sector 2", "Sector 3"]
      }
    };
  }
});

const cache = {};
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

function calculateGreenScore(pm25, MathPm10) {
  const pm10 = MathPm10 || 50;
  const pm_25 = pm25 || 25;
  const aqi25 = Math.min(500, pm_25 * 2.5);
  const aqi10 = Math.min(500, pm10 * 1.5);
  const aqi = Math.max(aqi25, aqi10);
  
  const airScore = Math.max(0, 100 - (aqi / 500) * 100);
  return Math.round(airScore);
}

export function mockApiPlugin() {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/state-data')) {
          const urlParams = new URL(req.url, `http://${req.headers.host}`);
          const state = urlParams.searchParams.get('state');

          if (!state) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: "State parameter is required" }));
          }

          const cacheKey = `state_data_${state}`;
          if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(cache[cacheKey].data));
          }

          let seed = 0;
          for(let i=0; i<state.length; i++) seed += state.charCodeAt(i);
          const fallbackPm25 = 20 + (seed % 50);
          const fallbackPm10 = 40 + (seed % 60);

          let cities = STATE_CITY_MAP[state];
          if (!cities) {
            const greenScore = calculateGreenScore(fallbackPm25, fallbackPm10);
            const result = { state, pm25: fallbackPm25, pm10: fallbackPm10, green_score: greenScore, isFallback: true };
            cache[cacheKey] = { data: result, timestamp: Date.now() };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(result));
          }

          let totalPm25 = 0;
          let totalPm10 = 0;
          let validDataPoints = 0;

          try {
            await Promise.all(cities.map(async (city) => {
              try {
                const fetchUrl = `https://api.openaq.org/v2/latest?city=${encodeURIComponent(city.name)}`;
                const response = await globalThis.fetch(fetchUrl);
                if (!response.ok) return;
                const json = await response.json();

                if (json.results && json.results.length > 0) {
                  const measurements = json.results[0].measurements || [];
                  const pm25Item = measurements.find(m => m.parameter === 'pm25' || m.parameter === 'pm2.5');
                  const pm10Item = measurements.find(m => m.parameter === 'pm10');
                  
                  const pm25 = pm25Item ? pm25Item.value : 0;
                  const pm10 = pm10Item ? pm10Item.value : 0;
                  
                  if (pm25 > 0 || pm10 > 0) {
                    totalPm25 += pm25;
                    totalPm10 += pm10;
                    validDataPoints++;
                  }
                }
              } catch (innerErr) {
                 // Ignore single city fetch errors to prevent unhandled rejection leak
              }
            }));

            if (validDataPoints === 0) throw new Error("No data fetched from OpenAQ");

            const avgPm25 = Math.round((totalPm25 / validDataPoints) * 10) / 10;
            const avgPm10 = Math.round((totalPm10 / validDataPoints) * 10) / 10;
            const greenScore = calculateGreenScore(avgPm25, avgPm10);

            const result = {
              state: state,
              pm25: avgPm25,
              pm10: avgPm10,
              green_score: greenScore,
              isFallback: false
            };

            cache[cacheKey] = { data: result, timestamp: Date.now() };

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(result));

          } catch (error) {
            console.log(`[Mock API] OpenAQ live fetch failed for state: ${state}. Applying AI Fallback data dynamically.`);
            const greenScore = calculateGreenScore(fallbackPm25, fallbackPm10);
            const result = {
              state: state,
              pm25: fallbackPm25,
              pm10: fallbackPm10,
              green_score: greenScore,
              isFallback: true
            };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(result));
          }
        } else if (req.url.startsWith('/api/hierarchy')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(LOCATION_HIERARCHY));
        } else if (req.url.startsWith('/api/district-data')) {
           const urlParams = new URL(req.url, `http://${req.headers.host}`);
           const district = urlParams.searchParams.get('district');
           const state = urlParams.searchParams.get('state') || "";
           
           let seed = 0;
           for(let i=0; i<district.length; i++) seed += district.charCodeAt(i);
           
           const pm25 = 20 + (seed % 40);
           const pm10 = pm25 + 15 + (seed % 30);
           const greenScore = calculateGreenScore(pm25, pm10);
           
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           return res.end(JSON.stringify({
              district, state, pm25, pm10, green_score: greenScore, level: 'district'
           }));
         } else if (req.url.startsWith('/api/get-districts')) {
           const urlParams = new URL(req.url, `http://${req.headers.host}`);
           const state = urlParams.searchParams.get('state') || "";

           try {
              const fetchUrl = 'https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json';
              const response = await globalThis.fetch(fetchUrl);
              const data = await response.json();
              const stateObj = data.states.find(s => s.state.toLowerCase() === state.toLowerCase());
              if (stateObj && stateObj.districts) {
                 res.statusCode = 200;
                 res.setHeader('Content-Type', 'application/json');
                 return res.end(JSON.stringify({ districts: stateObj.districts }));
              }
              throw new Error("State not found in DB");
           } catch(e) {
              console.log(`[Mock API] Database fetch failed for district query in ${state}. Applying AI Fallback data dynamically.`);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: "Failed to fetch real dataset" }));
           }
        } else if (req.url.startsWith('/api/area-data')) {
           const urlParams = new URL(req.url, `http://${req.headers.host}`);
           const area = urlParams.searchParams.get('area') || "";
           const district = urlParams.searchParams.get('district') || "";
           
           let seed = 0;
           for(let i=0; i<area.length; i++) seed += area.charCodeAt(i);
           
           const pm25 = 10 + (seed % 50);
           const pm10 = pm25 + 10 + (seed % 20);
           const greenScore = calculateGreenScore(pm25, pm10);
           
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           return res.end(JSON.stringify({
              area, district, pm25, pm10, green_score: greenScore, level: 'area'
           }));
        } else if (req.url.startsWith('/api/leaderboard')) {
          const urlParams = new URL(req.url, `http://${req.headers.host}`);
          const stateParam = urlParams.searchParams.get('state') || "";
          const districtParam = urlParams.searchParams.get('district') || "";

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          
          if (districtParam && stateParam) {
             // Return generic areas of the district
             const areas = [`${districtParam} Zone 1`, `${districtParam} Zone 2`, `${districtParam} Zone 3`, `${districtParam} Zone 4`];
             const leaderboard = areas.map(area => {
                let seed = 0; for(let i=0; i<area.length; i++) seed += area.charCodeAt(i);
                const p25 = 15 + (seed % 40);
                const p10 = p25 + 10 + (seed % 30);
                return { name: area, type: 'area', green_score: calculateGreenScore(p25, p10), pm25: p25, pm10: p10 };
             }).sort((a,b) => b.green_score - a.green_score);
             return res.end(JSON.stringify(leaderboard));
          } else if (stateParam) {
             // Generate dynamic districts leaderboard, attempt fetching real ones
             try {
                const response = await globalThis.fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json');
                const data = await response.json();
                const stateObj = data.states.find(s => s.state.toLowerCase() === stateParam.toLowerCase());
                let districts = stateObj && stateObj.districts ? stateObj.districts : Object.keys(LOCATION_HIERARCHY[stateParam] || {});
                
                // Fallback if APIs fail entirely
                if (districts.length === 0) districts = [`${stateParam} North`, `${stateParam} South`, `${stateParam} Central`];

                const leaderboard = districts.map(dist => {
                   let seed = 0; for(let i=0; i<dist.length; i++) seed += dist.charCodeAt(i);
                   const p25 = 20 + (seed % 50);
                   const p10 = p25 + 15 + (seed % 30);
                   return { name: dist, type: 'district', green_score: calculateGreenScore(p25, p10), pm25: p25, pm10: p10 };
                }).sort((a,b) => b.green_score - a.green_score).slice(0, 15); // Top 15 to keep UI clean
                return res.end(JSON.stringify(leaderboard));
             } catch (e) {
                // Sync fallback to hierarchy map
                const districts = Object.keys(LOCATION_HIERARCHY[stateParam] || {});
                const leaderboard = (districts.length ? districts : [`${stateParam} North`, `${stateParam} South`]).map(dist => {
                   let seed = 0; for(let i=0; i<dist.length; i++) seed += dist.charCodeAt(i);
                   const p25 = 20 + (seed % 50);
                   const p10 = p25 + 15 + (seed % 30);
                   return { name: dist, type: 'district', green_score: calculateGreenScore(p25, p10), pm25: p25, pm10: p10 };
                }).sort((a,b) => b.green_score - a.green_score).slice(0, 15);
                return res.end(JSON.stringify(leaderboard));
             }
          } else {
             // Return states
             const topStates = Object.keys(LOCATION_HIERARCHY).slice(0, 8);
             const leaderboard = topStates.map(st => {
                 let seed = 0; for(let i=0; i<st.length; i++) seed += st.charCodeAt(i);
                 const p25 = 20 + (seed % 50);
                 const p10 = 40 + (seed % 60);
                 // Check cache for real data if available
                 const cacheKey = `state_data_${st}`;
                 if (cache[cacheKey]?.data?.isFallback === false) {
                    return { name: st, type: 'state', green_score: cache[cacheKey].data.green_score, pm25: cache[cacheKey].data.pm25, pm10: cache[cacheKey].data.pm10 };
                 }
                 return { name: st, type: 'state', green_score: calculateGreenScore(p25, p10), pm25: p25, pm10: p10 };
             }).sort((a,b) => b.green_score - a.green_score);
             return res.end(JSON.stringify(leaderboard));
          }
        }

        else if (req.url.startsWith('/api/map-data')) {
          const urlParams = new URL(req.url, `http://${req.headers.host}`);
          const stateParam = urlParams.searchParams.get('state') || "";

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          
          let citiesToFetch = [];
          
          if (!stateParam || stateParam === 'all' || stateParam === 'India') {
             // All cities
             Object.values(STATE_CITY_MAP).forEach(arr => citiesToFetch.push(...arr));
          } else {
             citiesToFetch = STATE_CITY_MAP[stateParam] || [];
             if (citiesToFetch.length === 0 && LOCATION_HIERARCHY[stateParam]) {
                citiesToFetch = Object.entries(LOCATION_HIERARCHY[stateParam]).map(([k, v]) => ({
                   name: k, lat: v.lat, lon: v.lon
                }));
             }
             if (citiesToFetch.length === 0) {
                 const baseLat = 20.0 + (stateParam.length % 5);
                 const baseLon = 77.0 + (stateParam.length % 5);
                 citiesToFetch = [
                    { name: `${stateParam} North`, lat: baseLat + 0.5, lon: baseLon },
                    { name: `${stateParam} South`, lat: baseLat - 0.5, lon: baseLon }
                 ];
             }
          }

          const resultCities = citiesToFetch.map((city) => {
             // deterministic mock
             let seed = 0;
             for(let i=0; i<city.name.length; i++) seed += city.name.charCodeAt(i);
             // dynamically varying based on time slightly to simulate live
             const timeVariation = Math.floor(Date.now() / 60000) % 10;
             const pm25 = 15 + (seed % 100) + timeVariation;
             const pm10 = pm25 + 20 + (seed % 50);
             
             return {
                name: city.name,
                lat: city.lat,
                lon: city.lon,
                pm25: pm25,
                pm10: pm10,
                green_score: calculateGreenScore(pm25, pm10)
             }
          });

          return res.end(JSON.stringify({
             state: stateParam || "All",
             cities: resultCities
          }));
        }

        next();
      });
    }
  };
}
