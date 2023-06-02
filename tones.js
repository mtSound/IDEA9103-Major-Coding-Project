// //////////////////////////////////////////////////////////////////
// /// GAIN NODES FOR OUTPUT
// //////////////////////////////////////////////////////////////////

// Create a gain nodes to tame signal before output, avoiding digital distortion.
const gainNode = new Tone.Gain(0.3).toDestination();
const gainNode2 = new Tone.Gain(0.1).toDestination();
const gainNode3 = new Tone.Gain(0.2).toDestination();

// //////////////////////////////////////////////////////////////////
// /// AUDIO EFFECTS AND UTILITIES
// //////////////////////////////////////////////////////////////////

const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(gainNode)
const pingPong = new Tone.PingPongDelay("8n", 0.8).connect(gainNode3);
const reverb = new Tone.Reverb(15).connect(gainNode3);
const reverb2 = new Tone.Reverb(5).connect(gainNode3);
const filter1 = new Tone.Filter(1000, 'bandpass').connect(gainNode2);
const autoFilter = new Tone.AutoFilter("2n").connect(gainNode3);
const feedbackDelay = new Tone.FeedbackDelay("2n", 0.8).connect(gainNode3);
const filter2 = new Tone.Filter(600, 'lowpass').connect(gainNode3);

//amplitude envelopes
const env1 = new Tone.AmplitudeEnvelope({
    attack: 0.05,
    decay: 0.25,
    sustain: 0.3,
    release: 0.1
}).chain(filter2,feedbackDelay,reverb);

const env2 = new Tone.AmplitudeEnvelope({
    attack: 0.05,
    decay: 0.5,
    sustain: 0.4,
    release: 0.2
}).chain(filter1,pingPong,reverb2);

// //////////////////////////////////////////////////////////////////
// /// INSTRUMENTS
// //////////////////////////////////////////////////////////////////

//pulsewave oscillator voice
const synth1 = new Tone.PulseOscillator("C3", 0.1).connect(env1);

/*second pulsewave oscillator voice tweaked for use when large numbers of lines are "alive" producing a
high number of collisions with the window edge*/
const synth2 = new Tone.PulseOscillator("C3", 0.85).connect(env2);

const now = Tone.now()

// //////////////////////////////////////////////////////////////////
// /// SCALES
// //////////////////////////////////////////////////////////////////

let scales1 = ['C2', 'C3', 'D3', 'G2', 'A#2','C3', 'C4', 'D5', 'G1', 'A#4']//carried over from personal test proj

let lowerScales1 = ['C1','D#1', 'F1', 'C2', 'D#2', 'F2', 'G2', 'A#2','C2','D#2', 'F2', 'C3', 'D#3', 'F3', 'G3', 'A#3' ]
let lowerScales2 = ['G#1','C2','D#2', 'F2', 'G2', 'G#2','C3','D#3', 'F3', 'G3']

let upperScales1 = ['F3','G3', 'G#3', 'C4','D#4','F4','G4', 'G#4', 'C5','D#5', 'G#4']
let upperScales2 = ['A#3','C4', 'F4', 'G#4', 'A#4','C5', 'F5', 'G#5']


let scalesBank=[scales1,lowerScales1,lowerScales2,upperScales1,upperScales2]
let selectedScale = scalesBank[0];

let upperScales3 = ['F4','G4', 'G#4', 'C5','D#5','F5','G5', 'G#5', 'C6','D#6', 'G#5']
let upperScales4 = ['A#4','C5', 'F5', 'G#5', 'A#5','C6', 'F6', 'G#6']

let scalesBank2=[upperScales3,upperScales4]
let selectedScale2 = scalesBank2[0];


//funciton for selecting a new scale randomly from the scalesBank array
function changeScaleSelection() {
    selectedScale = scalesBank[Math.floor(random(0,scalesBank.length-1))];
    selectedScale2 = scalesBank2[Math.round(random(0,scalesBank2.length-1))];
}

//function for grabbing a random note from the scale passed into it
function getRandNote(scale) {
    let randNote = scale[Math.round(random(scale.length-1))];
    return randNote;
}

// //////////////////////////////////////////////////////////////////
// /// MUSIC MACHINES
// //////////////////////////////////////////////////////////////////

//high smooth
function musicMachine1() {
    
    synth1.width.value=0.38;
    synth1.frequency.value=random(getRandNote(selectedScale));
    filter2.frequency.value=468;
    env1.release=0.9;
    feedbackDelay.feedback.value=0.85;
    feedbackDelay.delayTime.value="8n"

    synth1.start(now);
    env1.triggerAttack(now);
    env1.releaseCurve = [1, 0.3, 0.1, 0.06, 0.03, 0];
    env1.decayCurve = "exponential";
    setTimeout(() => {
        env1.triggerRelease();
    }, 15)
    
}

//high and tinny
function musicMachine2() {
    
    synth1.width.value=0.87;
    synth1.frequency.value=random(getRandNote(selectedScale));
    filter2.frequency.value=764;
    env1.release=1.1;
    feedbackDelay.feedback.value=0.7;
    feedbackDelay.delayTime.value="4n"

    synth1.start(now);
    env1.triggerAttack(now);
    env1.releaseCurve = [1, 0.3, 0.1, 0.06, 0.03, 0];
    env1.decayCurve = "exponential";
    setTimeout(() => {
        env1.triggerRelease();
    }, 15)
    
}

//low and smooth
function musicMachine3() {
    
    synth1.width.value=0.17;
    synth1.frequency.value=random(getRandNote(selectedScale));
    filter2.frequency.value=455;
    env1.release=1.28;
    feedbackDelay.feedback.value=0.6;
    feedbackDelay.delayTime.value="3t"

    synth1.start(now);
    env1.triggerAttack(now);
    env1.releaseCurve = [1, 0.3, 0.1, 0.06, 0.03, 0];
    env1.decayCurve = "exponential";
    setTimeout(() => {
        env1.triggerRelease();
    }, 15)
    
}

//long release harpsicord
function musicMachine4() {
    
    synth1.width.value=0.45;
    synth1.frequency.value=random(getRandNote(selectedScale));
    filter2.frequency.value=606;
    env1.release=3.28;
    feedbackDelay.feedback.value=0.5;

    synth1.start(now);
    env1.triggerAttack(now);
    env1.releaseCurve = [1, 0.3, 0.1, 0.06, 0.03, 0];
    env1.decayCurve = "exponential";
    setTimeout(() => {
        env1.triggerRelease();
    }, 15)
    
}

//stringlike
function musicMachine5() {
    
    synth1.width.value=0.91;
    synth1.frequency.value=random(getRandNote(selectedScale));
    filter2.frequency.value=758;
    env1.release=4;
    feedbackDelay.feedback.value=0.4;
    

    synth1.start(now);
    env1.triggerAttack(now);
    env1.releaseCurve = [1, 0.3, 0.1, 0.06, 0.03, 0];
    env1.decayCurve = "exponential";
    setTimeout(() => {
        env1.triggerRelease();
    }, 15)
    
}

//overload alternative
function musicMachineAlt() {

    synth2.frequency.value=random(getRandNote(selectedScale2));
    filter1.frequency.value=random(700,1000);

    synth2.start(now);
    env2.triggerAttack(now);
    env2.releaseCurve = [1, 0.3, 0.1, 0.06, 0.03, 0];
    env2.decayCurve = "exponential";
    setTimeout(() => {
        env2.triggerRelease();
    }, 15)
    
}



/*function to activate and play a single note one of the music machines, using conditional checks to play a different flavour
of synth tone depending on how many lines are drawn to the screen.
With fewer lines, larger envelope release times give longer tails to the notes. As more lines are 'alive'
on screen, the envelope times become shorter.
When a large volume of lines is present, an ethereal high tone with ping pong delay creates a spacey atmosphere*/
function tonePlayer() {

    if(lines.length<=20){
        musicMachine5();
    }
    else if(lines.length>=20 && lines.length<=35){
        musicMachine4();
    }
    else if(lines.length>=35 && lines.length<=55){
        musicMachine3();
    }
    else if(lines.length>=55 && lines.length<=90){
        musicMachine2();
    }
    else if(lines.length>=90 && lines.length<=120){
        musicMachine1();
    }
    else {
        musicMachineAlt();
    }
    
}


function playTone() {
    // Start Tone and then call the tonePlayer function when ready.
    Tone.start().then(tonePlayer);
}