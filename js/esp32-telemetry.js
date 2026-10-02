window.initTelemetryStream = function() {
if (!window.sbrDb) {
console.error("Firebase Realtime Database (window.sbrDb) not initialized.");
return;
}

// Connection state listener for ESP32/Firebase status
const connectedRef = window.sbrDb.ref('.info/connected');
connectedRef.on('value', function(snap) {
    const plcStatusEl = document.getElementById('plc-status');
    if (snap.val() === true) {
        console.log("ESP32 TELEMETRY ONLINE");
        if (plcStatusEl) {
            plcStatusEl.style.backgroundColor = '#10b981'; 
        }
    } else {
        console.error("ESP32 TELEMETRY OFFLINE");
        if (plcStatusEl) {
            plcStatusEl.style.backgroundColor = '#ef4444'; 
        }
    }
});

// Listen to the 5-liter batch cycle telemetry node
const telemetryRef = window.sbrDb.ref('sbr_live_data');
telemetryRef.on('value', function(snapshot) {
    if (snapshot.exists()) {
        const data = snapshot.val();

        // Extract exact variables pushed by the ESP32
        const ph = data.pH;
        const turbidity = data.turbidity;
        const tds = data.tds;
        const temperature = data.temperature;
        const ultrasonic_level = data.ultrasonic_level;
        const flow_rate = data.flow_rate;

        // Update DOM elements formatted to 2 decimal places
        updateUIValue('pv-ph', ph);
        updateUIValue('pv-turbidity', turbidity);
        updateUIValue('pv-tds', tds);
        updateUIValue('pv-temperature', temperature);
        updateUIValue('pv-ultrasonic', ultrasonic_level);
        updateUIValue('pv-flow', flow_rate);
    }
}, function(error) {
    console.error("Telemetry Read Failed: " + error.message);
});
};

function updateUIValue(elementId, value) {
const el = document.getElementById(elementId);
if (el && value !== undefined && value !== null) {
const numValue = parseFloat(value);
if (!isNaN(numValue)) {
el.innerText = numValue.toFixed(2);
}
}
}

document.addEventListener('DOMContentLoaded', function() {
if (window.sbrDb) {
window.initTelemetryStream();
}
});