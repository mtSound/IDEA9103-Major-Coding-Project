// Blank doc for @MrEvanJ1 to incorporate tone


//////////////////////////////////////////////////////////////////
/// GAIN NODES FOR OUTPUT
//////////////////////////////////////////////////////////////////

// Create a gain nodes to tame signal before output, avoiding digital distortion.
const gainNode = new Tone.Gain(0.3).toDestination();
// const gainNode2 = new Tone.Gain(0.2).toDestination();
const gainNode3 = new Tone.Gain(0.2).toDestination();

//////////////////////////////////////////////////////////////////
/// AUDIO EFFECTS AND UTILITIES
//////////////////////////////////////////////////////////////////

const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(gainNode)
const pingPong = new Tone.PingPongDelay("8n", 0.5).connect(gainNode);
const reverb = new Tone.Reverb(15).connect(gainNode3);
const reverb2 = new Tone.Reverb(5).connect(gainNode3);
const filter = new Tone.Filter(1200, 'bandpass').connect(gainNode3);
const autoFilter = new Tone.AutoFilter("2n").connect(gainNode3);
const feedbackDelay = new Tone.FeedbackDelay(0.25, 0.6).connect(gainNode3);
const filter2 = new Tone.Filter(600, 'lowpass').connect(gainNode3);


const env1 = new Tone.AmplitudeEnvelope({
    attack: 0.05,
    decay: 0.25,
    sustain: 0.3,
    release: 0.1
}).chain(filter2,reverb);

//////////////////////////////////////////////////////////////////
/// INSTRUMENTS
//////////////////////////////////////////////////////////////////

//pulsewave oscillator voice
const synth1 = new Tone.PulseOscillator("C3", 0.1).connect(env1);

//thin pluck sounding voice
const plucky = new Tone.PluckSynth().connect(reverb2);

//////////////////////////////////////////////////////////////////
/// FUNCTIONS
//////////////////////////////////////////////////////////////////

//function to enable audio context
function enableTone(){
    Tone.start();
}

//function to check if audio is enables and then trigger the pulsewave oscillator synth
function playTone(){
    if(isPlaying){
        musicMachine1();
    }
}

//function for stopping audio
function stopTone(){
    synth1.stop()
}

//selects a new scale randomly from the scalesBank array
function changeScaleSelection() {
    selectedScale = scalesBank[Math.floor(random(0,scalesBank.length-1))];
}

//function for grabbing a random note from the scale passed into it
function getRandNote(scale) {
    let randNote = scale[Math.round(random(notes1.length-1))];
    return randNote;
}

//////////////////////////////////////////////////////////////////
/// MUSIC MACHINES
//////////////////////////////////////////////////////////////////


function musicMachine1() {
    
    synth1.start();
    env1.triggerAttack();
    env1.releaseCurve = [1, 0.3, 0.1, 0.06, 0.03, 0];
    env1.decayCurve = "exponential";
    setTimeout(() => {
        env1.triggerRelease();
    }, 15)
    synth1.width.value=sldr2Val;
    synth1.frequency.value=random(getRandNote(selectedScale));
    filter2.frequency.value=sldr3Val;
    env1.release=sldr4Val;
    
}


//////////////////////////////////////////////////////////////////
/// SCALES
//////////////////////////////////////////////////////////////////

let notes1 = ['C2', 'C3', 'D3', 'G2', 'A#2','C3', 'C4', 'D5', 'G1', 'A#4']//carried over from personal test proj

let lowerScales1 = ['C1','D#1', 'F1', 'C2', 'D#2', 'F2', 'G2', 'A#2','C2','D#2', 'F2', 'C3', 'D#3', 'F3', 'G3', 'A#3' ]
let lowerScales2 = ['G#1','C2','D#2', 'F2', 'G2', 'G#2','C3','D#3', 'F3', 'G3']

let upperScales1 = ['F3','G3', 'G#3', 'C4','D#4','F4','G4', 'G#4', 'C5','D#5', 'G#4']
let upperScales2 = ['A#3','C4', 'F4', 'G#4', 'A#4','C5', 'F5', 'G#5']


let scalesBank=[notes1,lowerScales1,lowerScales2,upperScales1,upperScales2]

let selectedScale = scalesBank[0];

